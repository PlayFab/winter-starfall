using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using PlayFab.EconomyModels;
using PlayFab.Samples;

namespace WinterStarfall
{
    class SellItemRequest
    {
        public string ItemId { get; set; }

        public int Amount { get; set; }
    }

    public class SellItem
    {
        private readonly ILogger<SellItem> log;

        public SellItem(ILogger<SellItem> logger)
        {
            log = logger;
        }

        [Function("SellItem")]
        public async Task<dynamic> Run([HttpTrigger(Microsoft.Azure.Functions.Worker.AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req)
        {
            FunctionExecutionContext<SellItemRequest> context = JsonConvert.DeserializeObject<FunctionExecutionContext<SellItemRequest>>(await req.ReadAsStringAsync());
            var player = new PlayFabPlayer(context.CallerEntityProfile, context.TitleAuthenticationContext);
            var request = context.FunctionArgument;

            try
            {
                // Do you even have this thing?
                var itemInInventory = await PlayFabFunctions.GetInventoryItemsByFilterAsync(player, $"id eq '{request.ItemId}'", log);
                if(itemInInventory.Count == 0)
                {
                    var error = $"SellItem failed. Player does not have {request.ItemId}. {player}";
                    log.LogError(error);
                    return new PlayFabErrorResponse(error);
                }

                // Get the item
                var items = await PlayFabFunctions.GetItemsAsync(player, new List<string> { request.ItemId }, log);
                var item = items.First(i => i.Id == request.ItemId);

                // Get your sell multiplier
                var titleData = await PlayFabFunctions.GetTitleDataAsync(player, new List<string> { TitleDataKeys.Multipliers }, log);
                var sellMultiplier = JsonConvert.DeserializeObject<Multipliers>(titleData[TitleDataKeys.Multipliers])?.sell ?? 1;

                // Give you the money for the thing multiplied by the amount
                var clampedAmount = Math.Clamp(request.Amount, 0, (int)itemInInventory.First().Amount);
                var itemsReceivedFromSelling = GetPricesForItemsToSell(item.PriceOptions);
                await PlayFabFunctions.AddInventoryItemsAsync(player, itemsReceivedFromSelling.ToDictionary(i => i.Id, i => (int)Math.Ceiling(i.Amount.Value * clampedAmount * sellMultiplier)), log);

                // Subtract the thing from your inventory
                await PlayFabFunctions.SubtractInventoryItemsAsync(player, new Dictionary<string, int> { { request.ItemId, clampedAmount } }, log);

                // All good, the client will refresh your inventory
                return new PlayFabSuccessResponse();
            }
            catch (Exception ex)
            {
                var error = $"SellItem failed. Exception {ex.Message} Request {JsonConvert.SerializeObject(request)} {player}";
                log.LogError(ex, error);
                return new PlayFabErrorResponse(error);
            }
        }

        public List<CatalogItemReference> GetPricesForItemsToSell(CatalogPriceOptions priceOptions)
        {
            List<CatalogItemReference> prices = new List<CatalogItemReference>();

            if (priceOptions != null)
            {
                foreach (var price in priceOptions.Prices)
                {
                    prices.AddRange(price.Amounts?.Select(priceAmounts => new CatalogItemReference { Amount = priceAmounts.Amount, Id = priceAmounts.ItemId }));
                }
            }

            return prices;
        }
    }
}
