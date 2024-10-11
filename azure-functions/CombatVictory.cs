using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using PlayFab.EconomyModels;
using PlayFab.Samples;

namespace WinterStarfall
{
	class CombatDoneRequest
	{
		public PlayerPartyReadOnly party { get; set; }

		public int xpEarned { get; set; }

		public string reward { get; set; }

		public Dictionary<string, int> itemsUsed { get; set; }

		public CombatDoneRequest()
		{
			party = new PlayerPartyReadOnly();
			reward = "";
			itemsUsed = new Dictionary<string, int>();
		}
	}

	class CombatDoneResult
	{
		public List<CatalogItemReference> itemsGranted { get; set; }

		public List<PlayerCharacterReadOnly> characters { get; set; }

		public CombatDoneResult()
		{
			itemsGranted = new List<CatalogItemReference>();
			characters = new List<PlayerCharacterReadOnly>();
		}
	}

	public class CombatVictory
	{
		private readonly ILogger<CombatVictory> log;

		public CombatVictory(ILogger<CombatVictory> logger)
		{
			log = logger;
		}

		[Function("CombatVictory")]
		public async Task<dynamic> Run([HttpTrigger(Microsoft.Azure.Functions.Worker.AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req)
		{
			FunctionExecutionContext<CombatDoneRequest> context = JsonConvert.DeserializeObject<FunctionExecutionContext<CombatDoneRequest>>(await req.ReadAsStringAsync());
			var player = new PlayFabPlayer(context.CallerEntityProfile, context.TitleAuthenticationContext);

			var request = context.FunctionArgument;

			try
			{
				List<CatalogItemReference> itemsToGrant = new List<CatalogItemReference>();

				// Look up the reward item, if it exists
				if (!string.IsNullOrEmpty(request.reward))
				{
					var rewardBundle = await PlayFabFunctions.GetItemByFriendlyIdAsync(player, request.reward, log);

					// It should be a single item!
					if (rewardBundle == null)
					{
						var error = $"Could not find reward item '{request.reward}'";
						log.LogError(error);
						return new PlayFabErrorResponse(error);
					}

					// Look up the item in question
					// Assume it's a bundle, thus we need to grant its item references.
					itemsToGrant = rewardBundle.ItemReferences;

					if (rewardBundle.ItemReferences == null || !rewardBundle.ItemReferences.Any())
					{
						// Nope, it's just one thing
						itemsToGrant = new List<CatalogItemReference>{new CatalogItemReference{
							Amount = 1,
							Id = rewardBundle.Id
						}};
					}

					// Grant items
					await PlayFabFunctions.AddInventoryItemsAsync(player, itemsToGrant.ToDictionary(i => i.Id, i => i.Amount.Value), log);
				}

				// Take away items you used
				if (request.itemsUsed.Any())
				{
					await PlayFabFunctions.SubtractInventoryItemsAsync(player, request.itemsUsed, log);
				}

				// Give the alive characters some XP
				var party = new PlayerPartyReadOnly((await PlayFabFunctions.GetUserReadOnlyDataAsync(player, new List<string> { UserDataKeysReadOnly.Party }, log)).Data);
				party.characters = party.characters.Select(c =>
				{
					var comparison = request.party.characters.FirstOrDefault(c2 => c.id == c2.id);

					if (comparison == null)
					{
						return c;
					}

					c.hp = comparison.hp;

					return c;
				}).ToList();

				party.characters = party.characters.Select(c => {
					if(!c.available || c.hp <= 0) {
						return c;
					}

					c.AddXP(request.xpEarned);
					return c;
				}).ToList();

				await PlayFabFunctions.UpdateUserReadOnlyDataAsync(player, new Dictionary<string, string> { { UserDataKeysReadOnly.Party, JsonConvert.SerializeObject(party) } }, new List<string>(), log);

				// Inform the user
				return new PlayFabSuccessResponse(new CombatDoneResult
				{
					itemsGranted = itemsToGrant,
					characters = party.characters
				});
			}
			catch (Exception ex)
			{
				log.LogError(ex, "Could not run CombatVictory on " + player);

				return new PlayFabErrorResponse(ex);
			}
		}
	}
}