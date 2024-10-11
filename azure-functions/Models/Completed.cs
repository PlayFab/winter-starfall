using PlayFab.ServerModels;
using Newtonsoft.Json;

namespace WinterStarfall
{
    public class PlayerCompletedReadOnly
    {
        public bool initialGrant { get; set; }

        public List<string> checkpoints { get; set; }

        public PlayerCompletedReadOnly()
        {
            initialGrant = true;
            checkpoints = new List<string>();
        }

        public PlayerCompletedReadOnly(Dictionary<string, UserDataRecord> data)
        {
            if (data == null)
            {
                return;
            }

            UserDataRecord userData;

            if (!data.TryGetValue(UserDataKeysReadOnly.Completed, out userData))
            {
                return;
            }

            var replacement = JsonConvert.DeserializeObject<PlayerCompletedReadOnly>(userData.Value);

            if (replacement == null)
            {
                return;
            }

            initialGrant = replacement.initialGrant;
            checkpoints = replacement.checkpoints;
        }
    }
}
