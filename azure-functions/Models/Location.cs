using PlayFab.ServerModels;
using Newtonsoft.Json;

namespace WinterStarfall
{
    public class PlayerLocation
    {
        public string id { get; set; }

        public string[] map { get; set; }

        public PlayerLocation()
        {
            id = "intro";
            map = new[] { "intro", "intro-village" };
        }

        public PlayerLocation(Dictionary<string, UserDataRecord> data)
        {
            if (data == null)
            {
                return;
            }

            UserDataRecord userData;

            if (!data.TryGetValue("location", out userData))
            {
                return;
            }

            var replacement = JsonConvert.DeserializeObject<PlayerLocation>(userData.Value);

            if (replacement == null)
            {
                return;
            }

            id = replacement.id;
            map = replacement.map;
        }
    }
}
