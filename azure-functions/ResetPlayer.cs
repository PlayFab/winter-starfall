using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using PlayFab.Samples;

namespace WinterStarfall
{
	public class ResetPlayer
	{
		private readonly ILogger<ResetPlayer> log;

		public ResetPlayer(ILogger<ResetPlayer> logger)
		{
			log = logger;
		}

		[Function("ResetPlayer")]
		public async Task<dynamic> Run([HttpTrigger(Microsoft.Azure.Functions.Worker.AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req)
		{
			FunctionExecutionContext<dynamic> context = JsonConvert.DeserializeObject<FunctionExecutionContext<dynamic>>(await req.ReadAsStringAsync());
			var player = new PlayFabPlayer(context.CallerEntityProfile, context.TitleAuthenticationContext);

			try
			{
				// Wipe out your user data (regular and read-only)
				await PlayFabFunctions.UpdateUserDataAsync(player, new Dictionary<string, string>(),
					new List<string>() { UserDataKeysPlayer.Location, UserDataKeysPlayer.Party, UserDataKeysPlayer.Stats, UserDataKeysPlayer.Notifications, UserDataKeysPlayer.CinematicProgression, UserDataKeysPlayer.EnemyGroupProgression },
				log);

				await PlayFabFunctions.UpdateUserReadOnlyDataAsync(player, new Dictionary<string, string>(),
					new List<string>() { UserDataKeysReadOnly.Completed, UserDataKeysReadOnly.Party },
				log);

				// Wipe out all items
				var inventory = await PlayFabFunctions.GetInventoryItemsByFilterAsync(player, string.Empty, log);
				await PlayFabFunctions.SubtractInventoryItemsAsync(player, inventory.ToDictionary(i => i.Id, i => (int)i.Amount), log);

				// Wipe out statistics
				await PlayFabFunctions.UpdatePlayerStatisticsAsync(player, new Dictionary<string, int> { { PlayerStatistics.progress, 0 } }, log);

				return new PlayFabSuccessResponse();
			}
			catch (Exception ex)
			{
				var error = $"ResetPlayer failed. {ex.Message} {player}";
				log.LogError(ex, error);
				return new PlayFabErrorResponse(error);
			}
		}
	}
}
