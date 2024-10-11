using PlayFab.Samples;
using PlayFab;

namespace WinterStarfall
{
    public class PlayFabPlayer
    {
        public string PlayerId { get; private set; }
        public string EntityId { get; private set; }
        public string EntityType { get; private set; }
        public PlayFabAuthenticationContext TitleAuthenticationContext { get; private set; }

        public PlayFab.EconomyModels.EntityKey EconomyEntityKey { get; private set; }

        public PlayFabPlayer() { }

        public PlayFabPlayer(PlayFab.ProfilesModels.EntityProfileBody entityProfile, TitleAuthenticationContext titleAuthenticationContext)
        {
            PlayerId = entityProfile.Lineage.MasterPlayerAccountId;
            EntityId = entityProfile.Entity.Id;
            EntityType = entityProfile.Entity.Type;

            EconomyEntityKey = new PlayFab.EconomyModels.EntityKey
            {
                Id = EntityId,
                Type = EntityType
            };

            TitleAuthenticationContext = new PlayFabAuthenticationContext
            {
                EntityType = "title",
                EntityId = titleAuthenticationContext.Id,
                EntityToken = titleAuthenticationContext.EntityToken
            };
        }

        public override string ToString()
        {
            return $"Player ID: {PlayerId}, Title ID: {TitleAuthenticationContext.EntityId}";
        }
    }
}
