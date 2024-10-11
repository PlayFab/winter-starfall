using PlayFab.EconomyModels;
using PlayFab.ServerModels;
using Newtonsoft.Json;

namespace WinterStarfall
{
	public class PlayerPartyWriteable
	{
		public List<PlayerCharacterWriteable> characters { get; set; }

		public List<PlayerCharacterId> guests { get; set; }

		public PlayerPartyWriteable()
		{
			characters = new List<PlayerCharacterWriteable>();
			guests = new List<PlayerCharacterId>();
		}

		public PlayerPartyWriteable(bool createInitialCharacters)
		{
			characters = new List<PlayerCharacterWriteable>();
			guests = new List<PlayerCharacterId>();

			if (!createInitialCharacters)
			{
				return;
			}

			characters.Add(new PlayerCharacterWriteable
			{
				id = PlayerCharacterId.Nadia,
			});
		}

		public PlayerPartyWriteable(Dictionary<string, UserDataRecord> data)
		{
			characters = new List<PlayerCharacterWriteable>();
			guests = new List<PlayerCharacterId>();

			if (data == null)
			{
				return;
			}

			UserDataRecord userData;

			if (!data.TryGetValue(UserDataKeysPlayer.Party, out userData))
			{
				return;
			}

			var replacement = JsonConvert.DeserializeObject<PlayerPartyWriteable>(userData.Value);

			if (replacement == null)
			{
				return;
			}

			characters = replacement.characters;
		}

		public void Add(PlayerCharacterId characterId)
		{
			if (characters.Any(c => c.id == characterId))
			{
				return;
			}

			characters.Add(new PlayerCharacterWriteable
			{
				id = characterId,
			});
		}

		public void RemoveAllGuests()
		{
			guests = new List<PlayerCharacterId>();
		}
	}

	public class PlayerPartyReadOnly
	{
		public List<PlayerCharacterReadOnly> characters { get; set; }

		public PlayerPartyReadOnly()
		{
			characters = new List<PlayerCharacterReadOnly>();
		}

		public PlayerPartyReadOnly(bool createInitialCharacters)
		{
			characters = new List<PlayerCharacterReadOnly>();

			if (!createInitialCharacters)
			{
				return;
			}

			Add(PlayerCharacterId.Nadia);
		}

		public PlayerPartyReadOnly(Dictionary<string, UserDataRecord> data)
		{
			characters = new List<PlayerCharacterReadOnly>();

			if (data == null)
			{
				return;
			}

			UserDataRecord userData;

			if (!data.TryGetValue(UserDataKeysReadOnly.Party, out userData))
			{
				return;
			}

			var replacement = JsonConvert.DeserializeObject<PlayerPartyReadOnly>(userData.Value);

			if (replacement == null)
			{
				return;
			}

			characters = replacement.characters;
		}

		public void Add(PlayerCharacterId characterId)
		{
			if (characters.Any(c => c.id == characterId))
			{
				return;
			}

			switch (characterId)
			{
				case PlayerCharacterId.Nadia:
					characters.Add(new PlayerCharacterReadOnly
					{
						id = PlayerCharacterId.Nadia,
						hp = 35,
						maxHP = 35,
						mp = 8,
						maxMP = 8,
						level = 1,
						attack = 1,
						defense = 1,
						available = true
					});
					break;
				case PlayerCharacterId.Sara:
					characters.Add(new PlayerCharacterReadOnly
					{
						id = characterId,
						hp = 30,
						maxHP = 30,
						mp = 0,
						maxMP = 0,
						level = 1,
						attack = 2,
						defense = 1,
						available = true
					});
					break;
				case PlayerCharacterId.Warren:
					characters.Add(new PlayerCharacterReadOnly
					{
						id = characterId,
						hp = 60,
						maxHP = 60,
						level = 2,
						xp = 150,
						attack = 3,
						defense = 2,
						available = true
					});
					break;
			}
		}

		public void Remove(PlayerCharacterId characterId)
		{
			if (!characters.Any(c => c.id == characterId))
			{
				return;
			}

			characters.FirstOrDefault(c => c.id == characterId)!.available = false;
		}

		public PlayerCharacterReadOnly Get(PlayerCharacterId characterId) {
			return characters.Find(c => c.id == characterId)!;
		}

		public void UnlockSaraMagic()
		{
			var sara = Get(PlayerCharacterId.Sara);
			sara.mp = 30;
			sara.maxMP = 30;
		}
	}

	public enum PlayerCharacterId
	{
		Sara = 0,
		Nadia = 1,
		Warren = 2,

		Shazim = 100,
		Lochan = 101,
		Anais = 102,
		Ronald = 103,
	}

	public class PlayerCharacterReadOnly
	{
		public PlayerCharacterId id { get; set; }

		public int hp { get; set; }

		public int maxHP { get; set; }

		public int mp { get; set; }

		public int maxMP { get; set; }

		public int level { get; set; }

		public int xp { get; set; }

		public int attack { get; set; }

		public int defense { get; set; }

		public bool available { get; set; }

		public int xpToNextLevel
		{
			get
			{
				if (level + 1 > xpThresholds.Length)
				{
					return int.MaxValue;
				}

				return xpThresholds[level];
			}
		}

		public int xpToCurrentLevel
		{
			get
			{
				if (level < 2)
				{
					return xpThresholds[0];
				}

				return xpThresholds[level - 1];
			}
		}

		private int[] xpThresholds = { 0, 100, 300, 900, 2000, 5000, 7500, 10000 };

		public PlayerCharacterReadOnly()
		{
			available = true;
		}

		public List<string> GetWeaponTags()
		{
			switch (id)
			{
				case PlayerCharacterId.Sara:
					return new List<string> { "knife", "fan" };
				case PlayerCharacterId.Nadia:
					return new List<string> { "bow", "spear" };
				case PlayerCharacterId.Warren:
					return new List<string> { "sword" };
				default:
					return new List<string>();
			}
		}

		public List<string> GetArmorTags()
		{
			switch (id)
			{
				case PlayerCharacterId.Sara:
				case PlayerCharacterId.Nadia:
					return new List<string> { "armor-light" };
				case PlayerCharacterId.Warren:
				default:
					return new List<string> { "armor-heavy" };
			}
		}

		public void AddXP(int value)
		{
			xp += value;

			// Find the current level based on accumulated XP
			int currentLevel = 1;
			for (int i = 1; i < xpThresholds.Length; i++)
			{
				if (xp >= xpThresholds[i])
				{
					currentLevel = i + 1;
				}
				else
				{
					break;
				}
			}

			// Update level and adjust stats if the level has changed
			if (currentLevel > level)
			{
				maxHP += 5 * (currentLevel - level);

				if (maxMP > 0)
				{
					maxMP += 5 * (currentLevel - level);
				}

				attack += 1 * (currentLevel - level);
				defense += 1 * (currentLevel - level);

				level = currentLevel;
				hp = maxHP;
			}
		}
	}

	public class PlayerCharacterWriteable
	{
		public PlayerCharacterId id { get; set; }

		public string armor { get; set; }

		public string weapon { get; set; }

		public List<string> spells { get; set; }

		public List<string> GetWeaponTags()
		{
			switch (id)
			{
				case PlayerCharacterId.Sara:
					return new List<string> { "fan", "knife" };
				case PlayerCharacterId.Nadia:
					return new List<string> { "bow", "spear" };
				case PlayerCharacterId.Warren:
					return new List<string> { "sword" };
				default:
					return new List<string>();
			}
		}

		public List<string> GetArmorTags()
		{
			switch (id)
			{
				case PlayerCharacterId.Sara:
				case PlayerCharacterId.Nadia:
					return new List<string> { "armor-light" };
				case PlayerCharacterId.Warren:
					return new List<string> { "armor-heavy" };
				default:
					return new List<string>();
			}
		}

		public void EquipFirstMatchingWeapon(List<InventoryItem> inventory, List<PlayFab.EconomyModels.CatalogItem> catalog)
		{
			if (!string.IsNullOrEmpty(weapon))
			{
				return;
			}

			var weaponTags = GetWeaponTags();

			var matchingItem = catalog.Where(c => c.Tags.Any(t => weaponTags.Contains(t))).FirstOrDefault(c => inventory.Any(i => i.Id == c.Id && i.Amount > 0));

			weapon = matchingItem?.Id ?? "";
		}

		public void EquipFirstMatchingArmor(List<InventoryItem> inventory, List<PlayFab.EconomyModels.CatalogItem> catalog)
		{
			if (!string.IsNullOrEmpty(armor))
			{
				return;
			}

			var armorTags = GetArmorTags();

			var matchingItem = catalog.FirstOrDefault(c => inventory.Any(i => i.Id == c.Id) && c.Tags.Any(t => armorTags.Contains(t)));

			armor = matchingItem?.Id ?? "";
		}
	}
}
