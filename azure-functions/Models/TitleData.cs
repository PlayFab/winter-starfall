namespace WinterStarfall
{
    public class TitleDataKeys
    {
        public static string Locations = "locations";
        public static string Enemies = "enemies";
        public static string EnemyGroups = "enemy_groups";
        public static string Multipliers = "multipliers";
    }

    public class Multipliers
    {
        public float sell { get; set; }
    }

    public class TitleDataEnemies
    {
        public string id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public int hp { get; set; }
        public int damage { get; set; }
        public int xp { get; set; }
        public int credits { get; set; }
    }

    public class TitleDataEnemyGroup
    {
        public string id { get; set; }
        public string[] enemies { get; set; }
        public string reward { get; set; } /* Friendly ID */
    }
}
