using Microsoft.Extensions.Logging;
using PlayFab.EconomyModels;
using PlayFab;
using PlayFab.ServerModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace WinterStarfall
{
    public class PlayFabFunctions
    {
        private static bool initialized = false;

        private static void Init()
        {
            if (initialized)
            {
                return;
            }

            if (string.IsNullOrEmpty(PlayFabSettings.staticSettings.DeveloperSecretKey))
            {
                PlayFabSettings.staticSettings.DeveloperSecretKey = Settings.TitleSecretKey;
            }

            if (string.IsNullOrEmpty(PlayFabSettings.staticSettings.TitleId))
            {
                PlayFabSettings.staticSettings.TitleId = Settings.TitleId;
            }

            initialized = true;
        }

        public static async Task<Dictionary<string, UserDataRecord>> GetUserDataAsync(PlayFabPlayer player, List<string> keys, ILogger log)
        {
            Init();

            PlayFabResult<GetUserDataResult> result = await PlayFabServerAPI.GetUserDataAsync(new GetUserDataRequest
            {
                AuthenticationContext = player.TitleAuthenticationContext,
                PlayFabId = player.PlayerId,
                Keys = keys
            });

            if (result.Error != null)
            {
                log.LogError(result.Error.ErrorMessage);
                throw new Exception(result.Error.ErrorMessage);
            }

            return result.Result.Data;
        }

        public static async Task<GetUserDataResult> GetUserInternalDataAsync(PlayFabPlayer player, List<string> keys, ILogger log)
        {
            Init();

            PlayFabResult<GetUserDataResult> result = await PlayFabServerAPI.GetUserInternalDataAsync(new GetUserDataRequest
            {
                AuthenticationContext = player.TitleAuthenticationContext,
                PlayFabId = player.PlayerId,
                Keys = keys
            });

            if (result.Error != null)
            {
                log.LogError(result.Error.ErrorMessage);
                throw new Exception(result.Error.ErrorMessage);
            }

            return result.Result;
        }

        public static async Task<GetUserDataResult> GetUserReadOnlyDataAsync(PlayFabPlayer player, List<string> keys, ILogger log)
        {
            Init();

            PlayFabResult<GetUserDataResult> result = await PlayFabServerAPI.GetUserReadOnlyDataAsync(new GetUserDataRequest
            {
                AuthenticationContext = player.TitleAuthenticationContext,
                PlayFabId = player.PlayerId,
                Keys = keys
            });

            if (result.Error != null)
            {
                log.LogError(result.Error.ErrorMessage);
                throw new Exception(result.Error.ErrorMessage);
            }

            return result.Result;
        }

        public static async Task<UpdateUserDataResult> UpdateUserInternalDataAsync(PlayFabPlayer player, Dictionary<string, string> data, List<string> keysToRemove, ILogger log)
        {
            Init();

            PlayFabResult<UpdateUserDataResult> result = await PlayFabServerAPI.UpdateUserInternalDataAsync(new UpdateUserInternalDataRequest
            {
                AuthenticationContext = player.TitleAuthenticationContext,
                PlayFabId = player.PlayerId,
                Data = data,
                KeysToRemove = keysToRemove,
            });

            if (result.Error != null)
            {
                log.LogError(result.Error.ErrorMessage);
                throw new Exception(result.Error.ErrorMessage);
            }

            return result.Result;
        }

        public static async Task<UpdateUserDataResult> UpdateUserReadOnlyDataAsync(PlayFabPlayer player, Dictionary<string, string> data, List<string> keysToRemove, ILogger log)
        {
            Init();

            PlayFabResult<UpdateUserDataResult> result = await PlayFabServerAPI.UpdateUserReadOnlyDataAsync(new UpdateUserDataRequest
            {
                AuthenticationContext = player.TitleAuthenticationContext,
                PlayFabId = player.PlayerId,
                Data = data,
                KeysToRemove = keysToRemove,
            });

            if (result.Error != null)
            {
                log.LogError(result.Error.ErrorMessage);
                throw new Exception(result.Error.ErrorMessage);
            }

            return result.Result;
        }

        public static async Task<UpdateUserDataResult> UpdateUserDataAsync(PlayFabPlayer player, Dictionary<string, string> data, List<string> keysToRemove, ILogger log)
        {
            Init();

            PlayFabResult<UpdateUserDataResult> result = await PlayFabServerAPI.UpdateUserDataAsync(new UpdateUserDataRequest
            {
                AuthenticationContext = player.TitleAuthenticationContext,
                PlayFabId = player.PlayerId,
                Data = data,
                KeysToRemove = keysToRemove,
            });

            if (result.Error != null)
            {
                log.LogError(result.Error.ErrorMessage);
                throw new Exception(result.Error.ErrorMessage);
            }

            return result.Result;
        }

        public static async Task<PlayFab.EconomyModels.CatalogItem> GetItemByFriendlyIdAsync(PlayFabPlayer player, string friendlyId, ILogger log)
        {
            Init();

            var result = await PlayFabEconomyAPI.GetItemAsync(new GetItemRequest
            {
                AuthenticationContext = player.TitleAuthenticationContext,
                AlternateId = new CatalogAlternateId { Type = "FriendlyId", Value = friendlyId },
            });

            if (result.Error != null)
            {
                log.LogError(result.Error.ErrorMessage);
                throw new Exception(result.Error.ErrorMessage);
            }

            return result.Result.Item;
        }

        public static async Task<List<PlayFab.EconomyModels.CatalogItem>> GetItemsAsync(PlayFabPlayer player, List<string> ids, ILogger log)
        {
            Init();

            var result = await PlayFabEconomyAPI.GetItemsAsync(new GetItemsRequest
            {
                AuthenticationContext = player.TitleAuthenticationContext,
                Ids = ids,
            });

            if (result.Error != null)
            {
                log.LogError(result.Error.ErrorMessage);
                throw new Exception(result.Error.ErrorMessage);
            }

            return result.Result.Items;
        }

        public static async Task<SearchItemsResponse> SearchItemsAsync(PlayFabPlayer player, SearchItemsRequest request, ILogger log)
        {
            Init();

            log.LogDebug($"SearchItemsAsync query: {request.Search}, count: {request.Count}, filter: {request.Filter}, orderBy: {request.OrderBy}");

            request.AuthenticationContext = player.TitleAuthenticationContext;
            var result = await PlayFabEconomyAPI.SearchItemsAsync(request);

            if (result.Error != null)
            {
                log.LogError(result.Error.ErrorMessage);
                throw new Exception(result.Error.ErrorMessage);
            }

            return result.Result;
        }

        public static async Task<AddInventoryItemsResponse> AddInventoryItemsAsync(PlayFabPlayer player, Dictionary<string, int> itemIdsAndQuantities, ILogger log)
        {
            Init();

            try
            {
                PlayFabResult<AddInventoryItemsResponse> result = new PlayFabResult<AddInventoryItemsResponse>();

                foreach (var item in itemIdsAndQuantities)
                {
                    result = await PlayFabEconomyAPI.AddInventoryItemsAsync(new AddInventoryItemsRequest
                    {
                        AuthenticationContext = player.TitleAuthenticationContext,
                        Amount = item.Value,
                        Entity = player.EconomyEntityKey,
                        Item = new InventoryItemReference
                        {
                            Id = item.Key
                        }
                    });
                }

                return result.Result;
            }
            catch (Exception ex)
            {
                string error = $"Could not grant items {JsonConvert.SerializeObject(itemIdsAndQuantities)} to {player.PlayerId} on title {player.TitleAuthenticationContext.EntityId}";
                log.LogError(ex, error);

                throw new Exception(error);
            }
        }

        public static async Task<SubtractInventoryItemsResponse> SubtractInventoryItemsAsync(PlayFabPlayer player, Dictionary<string, int> itemIdsAndQuantities, ILogger log)
        {
            Init();

            try
            {
                PlayFabResult<SubtractInventoryItemsResponse> result = new PlayFabResult<SubtractInventoryItemsResponse>();

                foreach (var item in itemIdsAndQuantities)
                {
                    result = await PlayFabEconomyAPI.SubtractInventoryItemsAsync(new SubtractInventoryItemsRequest
                    {
                        AuthenticationContext = player.TitleAuthenticationContext,
                        Amount = item.Value,
                        Entity = player.EconomyEntityKey,
                        DeleteEmptyStacks = true,
                        Item = new InventoryItemReference
                        {
                            Id = item.Key
                        }
                    });
                }

                return result.Result;
            }
            catch (Exception ex)
            {
                string error = $"Could not subtract items {JsonConvert.SerializeObject(itemIdsAndQuantities)} from {player}";
                log.LogError(ex, error);

                throw new Exception(error);
            }
        }

        public static async Task<List<InventoryItem>> GetInventoryItemsByFilterAsync(PlayFabPlayer player, string filter, ILogger log)
        {
            Init();

            var result = await PlayFabEconomyAPI.GetInventoryItemsAsync(new GetInventoryItemsRequest
            {
                AuthenticationContext = player.TitleAuthenticationContext,
                Entity = player.EconomyEntityKey,
                Filter = filter,
                Count = 50
            });

            if (result.Error != null)
            {
                log.LogError(result.Error.ErrorMessage);
                throw new Exception(result.Error.ErrorMessage);
            }

            return result.Result.Items;
        }

        public static async Task<List<StatisticValue>> GetPlayerStatisticsAsync(PlayFabPlayer player, List<string> statistics, ILogger log)
        {
            Init();

            var result = await PlayFabServerAPI.GetPlayerStatisticsAsync(new GetPlayerStatisticsRequest
            {
                AuthenticationContext = player.TitleAuthenticationContext,
                PlayFabId = player.PlayerId,
                StatisticNames = statistics,
            });

            if (result.Error != null)
            {
                log.LogError(result.Error.ErrorMessage);
                throw new Exception(result.Error.ErrorMessage);
            }

            return result.Result.Statistics;
        }

        public static async Task<UpdatePlayerStatisticsResult> UpdatePlayerStatisticsAsync(PlayFabPlayer player, Dictionary<string, int> statistics, ILogger log)
        {
            Init();

            var result = await PlayFabServerAPI.UpdatePlayerStatisticsAsync(new UpdatePlayerStatisticsRequest
            {
                AuthenticationContext = player.TitleAuthenticationContext,
                PlayFabId = player.PlayerId,
                Statistics = statistics.Select(s => new StatisticUpdate
                {
                    StatisticName = s.Key,
                    Value = s.Value
                }).ToList()
            });

            if (result.Error != null)
            {
                log.LogError(result.Error.ErrorMessage);
                throw new Exception(result.Error.ErrorMessage);
            }

            return result.Result;
        }

        public static async Task<Dictionary<string, string>> GetTitleDataAsync(PlayFabPlayer player, List<string> keys, ILogger log)
        {
            Init();

            var result = await PlayFabServerAPI.GetTitleDataAsync(new GetTitleDataRequest
            {
                AuthenticationContext = player.TitleAuthenticationContext,
                Keys = keys,
            });

            if (result.Error != null)
            {
                log.LogError(result.Error.ErrorMessage);
                throw new Exception(result.Error.ErrorMessage);
            }

            return result.Result.Data;
        }
    }

    public class PlayFabSuccessResponse : PlayFabResponseBase
    {
        public PlayFabSuccessResponse() : base("OK")
        {
            StatusCode = StatusCodes.Status200OK;
        }

        public PlayFabSuccessResponse(object data) : base(data)
        {
            StatusCode = StatusCodes.Status200OK;
        }
    }

    public class PlayFabErrorResponse : PlayFabResponseBase
    {
        public PlayFabErrorResponse(string error) : base(error)
        {
            StatusCode = StatusCodes.Status400BadRequest;
        }

        public PlayFabErrorResponse(Exception ex) : base(ex)
        {
            StatusCode = StatusCodes.Status400BadRequest;
        }
    }

    public abstract class PlayFabResponseBase : ObjectResult
    {
        public PlayFabResponseBase(object data) : base(data)
        {
            Value = JsonConvert.SerializeObject(data);
        }

        public PlayFabResponseBase(Exception ex) : base(ex.Message)
        {
            StatusCode = StatusCodes.Status400BadRequest;
            Value = JsonConvert.SerializeObject(ex);
        }
    }

    public class Settings
    {
        private const string _titleId = "PlayFab.TitleId";
        private const string _titleSecretKey = "PlayFab.TitleSecretKey";

        public static string TitleId = Environment.GetEnvironmentVariable(_titleId, EnvironmentVariableTarget.Process);
        public static string TitleSecretKey = Environment.GetEnvironmentVariable(_titleSecretKey, EnvironmentVariableTarget.Process);
    }
}
