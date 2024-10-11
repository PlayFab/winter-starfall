using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using PlayFab.EconomyModels;
using PlayFab.Samples;

namespace WinterStarfall
{
    public class PlayerCreated
    {
        private readonly ILogger<PlayerCreated> log;

        public PlayerCreated(ILogger<PlayerCreated> logger)
        {
            log = logger;
        }

        [Function("PlayerCreated")]
        public async Task<dynamic> Run([HttpTrigger(Microsoft.Azure.Functions.Worker.AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req)
        {
            FunctionExecutionContext<dynamic> context = JsonConvert.DeserializeObject<FunctionExecutionContext<dynamic>>(await req.ReadAsStringAsync());
            var player = new PlayFabPlayer(context.CallerEntityProfile, context.TitleAuthenticationContext);

            try
            {
                // Ensure you're a new player who has nothing
                var playerDataReadOnly = await PlayFabFunctions.GetUserReadOnlyDataAsync(player, new List<string> { UserDataKeysReadOnly.Completed }, log);

                if (playerDataReadOnly.Data != null)
                {
                    var completed = new PlayerCompletedReadOnly(playerDataReadOnly.Data);

                    if (completed.initialGrant)
                    {
                        // No calling this twice
                        var error = $"PlayerCreated failed. Already claimed initial grant package. {player}";
                        log.LogError(error);
                        return new PlayFabErrorResponse(error);
                    }
                }

                // Grant the initial item package and set the internal data notice that the player claimed their new player package
                var newPlayerBundle = await GetNewPlayerGrantBundle(player, log);

                if (newPlayerBundle == null || !newPlayerBundle.ItemReferences.Any())
                {
                    var error = $"PlayerCreated failed. Could not find new player bundle. {player}";
                    log.LogError(error);
                    return new PlayFabErrorResponse(error);
                }

                var newPlayerGrantResult = await PlayFabFunctions.AddInventoryItemsAsync(player, newPlayerBundle.ItemReferences.ToDictionary(i => i.Id, i => i.Amount.Value), log);

                // Assign read-only data
                await PlayFabFunctions.UpdateUserReadOnlyDataAsync(player, new Dictionary<string, string> {
                    { UserDataKeysReadOnly.Completed, JsonConvert.SerializeObject(new PlayerCompletedReadOnly()) },
                    { UserDataKeysReadOnly.Party, JsonConvert.SerializeObject(new PlayerPartyReadOnly(true)) }
                },
                new List<string>(),
                log);

                // Give the starting characters their default weapons and armor
                var inventory = await PlayFabFunctions.GetInventoryItemsByFilterAsync(player, string.Empty, log);
                var catalog = await PlayFabFunctions.GetItemsAsync(player, inventory.Select(i => i.Id).ToList(), log);
                var party = new PlayerPartyWriteable(true);

                party.characters.ForEach(character =>
                {
                    character.EquipFirstMatchingWeapon(inventory, catalog);
                    character.EquipFirstMatchingArmor(inventory, catalog);
                });

                // Assign your standard player data
                await PlayFabFunctions.UpdateUserDataAsync(player, new Dictionary<string, string> {
                    { UserDataKeysPlayer.Location, JsonConvert.SerializeObject(new PlayerLocation()) },
                    { UserDataKeysPlayer.Party, JsonConvert.SerializeObject(party) }
                    },
                new List<string>(),
                log);

                return new PlayFabSuccessResponse();
            }
            catch (Exception ex)
            {
                var error = $"PlayerCreated failed. {ex.Message} {player}";
                log.LogError(ex, error);
                return new PlayFabErrorResponse(error);
            }
        }

        private static async Task<CatalogItem?> GetNewPlayerGrantBundle(PlayFabPlayer player, ILogger log)
        {
            var newPlayerGrantItemSearch = await PlayFabFunctions.SearchItemsAsync(player, new SearchItemsRequest
            {
                Count = 1,
                Filter = $"alternateIds/any(x: x/Value eq '{ItemIdentifiers.NewPlayerGrantFriendlyId}')",
                Select = "contents"
            }, log);

            if (newPlayerGrantItemSearch.Items != null && newPlayerGrantItemSearch.Items.Count > 0)
            {
                return newPlayerGrantItemSearch.Items[0];
            }

            return null;
        }
    }
}