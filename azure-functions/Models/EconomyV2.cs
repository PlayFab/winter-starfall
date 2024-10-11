namespace WinterStarfall
{
    public class EconomyIdentifiers
    {
        public static string LocationType = "location";
    }

    public class ItemIdentifiers
    {
        public static string NewPlayerGrantFriendlyId = "new-grant";

        public static string WeaponContentType = "weapon";
        public static string ArmorContentType = "armor";
    }

    public class CatalogItemSearchParameters
    {
        public string search { get; set; }
        public string tags { get; set; }
        public string contentType { get; set; }
    }
}
