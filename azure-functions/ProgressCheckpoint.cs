using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using PlayFab.Samples;

namespace WinterStarfall
{
    class ProgressCheckpointRequest
    {
        public string checkpoint { get; set; }
    }

    public class ProgressCheckpoint
    {
        private readonly ILogger<ProgressCheckpoint> log;

        public ProgressCheckpoint(ILogger<ProgressCheckpoint> logger)
        {
            log = logger;
        }

        [Function("ProgressCheckpoint")]
        public async Task<dynamic> Run([HttpTrigger(Microsoft.Azure.Functions.Worker.AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req)
        {
            FunctionExecutionContext<ProgressCheckpointRequest> context = JsonConvert.DeserializeObject<FunctionExecutionContext<ProgressCheckpointRequest>>(await req.ReadAsStringAsync());
            var player = new PlayFabPlayer(context.CallerEntityProfile, context.TitleAuthenticationContext);

            var request = context.FunctionArgument;

            try
            {
                // Is this a valid checkpoint?
                if (!PlayerStatistics.ProgressCheckpoints.Contains(request.checkpoint))
                {
                    var error = $"ProgressCheckpoint failed. Invalid checkpoint '{request.checkpoint}'. {player}";
                    log.LogError(error);
                    return new PlayFabErrorResponse(error);
                }

                // Did you already unlock this one?
                var userReadOnlyData = await PlayFabFunctions.GetUserReadOnlyDataAsync(player, new List<string> { UserDataKeysReadOnly.Completed, UserDataKeysReadOnly.Party }, log);

                var completed = new PlayerCompletedReadOnly(userReadOnlyData.Data);

                if (completed.checkpoints.Contains(request.checkpoint))
                {
                    var error = $"ProgressCheckpoint failed. Already reached checkpoint '{request.checkpoint}'. {player}";
                    log.LogError(error);
                    return new PlayFabErrorResponse(error);
                }

                var userWriteableData = await PlayFabFunctions.GetUserDataAsync(player, new List<string> { UserDataKeysPlayer.Party }, log);

                await RunCheckpointSteps(player, new PlayerPartyReadOnly(userReadOnlyData.Data), new PlayerPartyWriteable(userWriteableData), completed, request.checkpoint);

                return new PlayFabSuccessResponse();
            }

            catch (Exception ex)
            {
                var error = $"ProgressCheckpoint failed. {ex.Message} {player}";
                log.LogError(ex, error);
                return new PlayFabErrorResponse(error);
            }
        }

        private async Task RunCheckpointSteps(PlayFabPlayer player, PlayerPartyReadOnly partyReadOnly, PlayerPartyWriteable partyWriteable, PlayerCompletedReadOnly completed, string checkpoint)
        {
            bool hasUpdatedPartyReadOnly = false;
            bool hasUpdatedPartyWriteable = false;

			List<PlayFab.EconomyModels.InventoryItem> inventory;
			List<PlayFab.EconomyModels.CatalogItem> catalog;
			string friendlyIdItemToGrant = "";

            completed.checkpoints.Add(checkpoint);

            switch (checkpoint)
            {
                case "first-battle":
                    partyReadOnly.Remove(PlayerCharacterId.Nadia);
                    partyReadOnly.Add(PlayerCharacterId.Sara);
                    partyWriteable.Add(PlayerCharacterId.Sara);

					inventory = await PlayFabFunctions.GetInventoryItemsByFilterAsync(player, "", log);
                    catalog = await PlayFabFunctions.GetItemsAsync(player, inventory.Select(i => i.Id).ToList(), log);

					var saraWriteable = partyWriteable.characters.Find(c => c.id == PlayerCharacterId.Sara)!;
					saraWriteable.EquipFirstMatchingWeapon(inventory, catalog);
					saraWriteable.EquipFirstMatchingArmor(inventory, catalog);

                    hasUpdatedPartyReadOnly = true;
                    hasUpdatedPartyWriteable = true;
                    break;
                case "uncaged":
                    partyReadOnly.Add(PlayerCharacterId.Warren);
                    partyWriteable.Add(PlayerCharacterId.Warren);

                    inventory = await PlayFabFunctions.GetInventoryItemsByFilterAsync(player, "", log);
                    catalog = await PlayFabFunctions.GetItemsAsync(player, inventory.Select(i => i.Id).ToList(), log);

                    var warrenWriteable = partyWriteable.characters.Find(c => c.id == PlayerCharacterId.Warren)!;
                    warrenWriteable.EquipFirstMatchingWeapon(inventory, catalog);
                    warrenWriteable.EquipFirstMatchingArmor(inventory, catalog);

                    completed.checkpoints.Add("party");

					friendlyIdItemToGrant = "progress-party";

                    hasUpdatedPartyReadOnly = true;
                    hasUpdatedPartyWriteable = true;
                    break;
				case "soldiers-rescued":
					// Ensure Sara is alive
					var sara = partyReadOnly.Get(PlayerCharacterId.Sara);

					if(sara.hp <= 0) {
						sara.hp = sara.maxHP;
					}
					hasUpdatedPartyReadOnly = true;
					break;
                case "sara-magic":
                    partyReadOnly.UnlockSaraMagic();
                    hasUpdatedPartyReadOnly = true;
                    break;
                case "anarta":
                    partyReadOnly.Remove(PlayerCharacterId.Sara);
					partyWriteable.RemoveAllGuests();
                    hasUpdatedPartyReadOnly = true;
					hasUpdatedPartyWriteable = true;
                    break;
            }

            var updateDictionaryReadOnly = new Dictionary<string, string>
            {
                { UserDataKeysReadOnly.Completed, JsonConvert.SerializeObject(completed) }
            };

            if (hasUpdatedPartyReadOnly)
            {
                updateDictionaryReadOnly.Add(UserDataKeysReadOnly.Party, JsonConvert.SerializeObject(partyReadOnly));
            }

            if (updateDictionaryReadOnly.Count > 0)
            {
                await PlayFabFunctions.UpdateUserReadOnlyDataAsync(player, updateDictionaryReadOnly, new List<string>(), log);
            }

            var updateDictionaryWriteable = new Dictionary<string, string>();

            if(hasUpdatedPartyWriteable)
            {
                updateDictionaryWriteable.Add(UserDataKeysPlayer.Party, JsonConvert.SerializeObject(partyWriteable));
            }

            if (updateDictionaryWriteable.Count > 0)
            {
                await PlayFabFunctions.UpdateUserDataAsync(player, updateDictionaryWriteable, new List<string>(), log);
            }

			if(!string.IsNullOrEmpty(friendlyIdItemToGrant)) {
				var grantItem = await PlayFabFunctions.GetItemByFriendlyIdAsync(player, friendlyIdItemToGrant, log);

				if(grantItem.ItemReferences.Count == 0) {
					await PlayFabFunctions.AddInventoryItemsAsync(player, new Dictionary<string, int>{{grantItem.Id, 1}}, log);
				}
				else {
					await PlayFabFunctions.AddInventoryItemsAsync(player, grantItem.ItemReferences.ToDictionary(item => item.Id, item => item.Amount.GetValueOrDefault()), log);
				}
				
			}

            await PlayFabFunctions.UpdatePlayerStatisticsAsync(player, new Dictionary<string, int> { { PlayerStatistics.progress, completed.checkpoints.Count } }, log);
        }
    }
}
