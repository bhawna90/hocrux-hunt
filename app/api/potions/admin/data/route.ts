import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { PotionsAdminState } from '@/app/types/potions';

// Default recipes for initial setup
const defaultRecipes = [
  {
    id: 'polyjuice',
    name: 'Polyjuice Potion',
    description: 'A transformative potion with a murky, muddy appearance',
    ingredients: [
      {
        name: 'Bitter Gourd',
        clue: 'A warty, lumpy green vegetable that makes even the bravest Gryffindor grimace in disgust. Its bitter essence is legendary among Muggles, yet prized by potion-makers for transformation brews. Bumpy as a troll\'s skin, green as a Slytherin banner.'
      },
      {
        name: 'Bottle Gourd Juice',
        clue: 'Pale green liquid squeezed from the elongated gourd that hangs like a potion flask from jungle vines. Mild yet mysterious, this watery extract flows clear as a memory in a Pensieve, essential for diluting the bitter transformation magic. Green-tinted and smooth as a Shape-Shifting charm!'
      },
      {
        name: 'Tamarind Water',
        clue: 'From twisted brown pods that hang like Dementor fingers, extract this sour liquid that makes your face pucker like you\'ve tasted Skele-Gro. Tangy as a hex, brown as a wand, sharp enough to transform any brew into something wickedly sour.'
      },
      {
        name: 'Water',
        clue: 'The clearest, most innocent liquid known to wizardkind - tasteless as air, essential as magic itself. Flowing from mountain streams or conjured with Aguamenti, this transparent elixir is the foundation of every potion from Hogwarts to Hogsmeade.'
      },
      {
        name: 'Lemon',
        clue: 'Bright yellow as a Hufflepuff scarf, this citrus orb makes your mouth pucker tighter than Filch\'s angry frown. Squeeze its tangy juice into your cauldron, sour enough to wake a sleeping dragon, sharp as a Stinging Hex on your tongue!'
      },
    ],
    instructions: [],
  },
  {
    id: 'felix-felicis',
    name: 'Felix Felicis (Liquid Luck)',
    description: 'A shimmering golden potion that brings good fortune',
    ingredients: [
      {
        name: 'Mango Juice',
        clue: 'The golden nectar of the king of fruits, thick and luxurious as liquid gold from Gringotts. Sweet as success, smooth as silk robes, this tropical treasure flows like molten sunshine - the very essence of good fortune in liquid form!'
      },
      {
        name: 'Raw Egg',
        clue: 'Crack open this oval gift from a common hen to reveal its slimy, slippery contents - yolk golden as a Snitch, white clear as Felix Felicis itself. Uncooked and trembling, it holds the promise of luck like a crystal ball holds the future!'
      },
      {
        name: 'Soda',
        clue: 'A bubbling, fizzing Muggle concoction that dances with enchanted bubbles! Clear as crystal, sparkling like house points in an hourglass, this effervescent liquid tickles your nose like Fizzing Whizzbees and brings lightness to any lucky brew!'
      },
      {
        name: 'Honey Water',
        clue: 'Sweet golden nectar collected by busy bees (second cousins to Billywigs, but far less magical), dissolved lovingly into pure water. Liquid sunshine that flows like prosperity, sweet as victory, golden as the luck you seek to brew!'
      },
      {
        name: 'Apple Juice',
        clue: 'Pale golden liquid pressed from orchard apples, crisp and clean as an Autumn morning in the Forbidden Forest. Not quite as golden as Felix itself, but shimmering with promise - fruity fortune in a bottle, blessed by nature\'s own magic!'
      },
    ],
    instructions: [],
  },
  {
    id: 'amortentia',
    name: 'Amortentia (Love Potion)',
    description: 'A pink potion with a distinctive mother-of-pearl sheen',
    ingredients: [
      {
        name: 'Pomegranate Juice',
        clue: 'Deep crimson liquid pressed from jewel-like seeds, the very fruit of love itself! Red as a beating heart, rich as passion, sweet yet tart - this ancient symbol of devotion bleeds ruby drops like liquid romance into your cauldron of desire.'
      },
      {
        name: 'Vanilla Essence',
        clue: 'A few precious drops of this dark brown extract that smells sweeter than Amortentia itself, like pudding in the Great Hall! But beware - taste it pure and it\'s bitter as heartbreak. Concentrated love magic in a tiny bottle, deceptively delicious!'
      },
      {
        name: 'Tabasco Sauce',
        clue: 'Fiery crimson drops of pure passion that set your mouth ablaze like dragon\'s breath! Just a dash of this Muggle love-fire brings heat to the heart and flames to romance. Red as Fawkes, hot as a Patronus, spicy as forbidden love!'
      },
      {
        name: 'Soda',
        clue: 'Bubbling with excitement like a first-year at the Sorting Ceremony! This clear, fizzing liquid dances with a thousand tiny bubbles - the effervescence of attraction, the sparkle of romance, the pop of Cupid\'s arrow striking true!'
      },
      {
        name: 'Honey',
        clue: 'Thick, sticky golden sweetness crafted by devoted bees, flowing slow as a love spell, clinging like an enchantment that won\'t let go. Sweet as a first kiss, golden as a wedding ring, viscous as the bond between soulmates destined by fate!'
      },
    ],
    instructions: [],
  },
  {
    id: 'draught-of-living-death',
    name: 'Draught of Living Death',
    description: 'A dark, ominous sleeping potion of great power',
    ingredients: [
      {
        name: 'Soy Sauce',
        clue: 'Begin with three careful spoonfuls of this mysterious black liquid that clings to Muggle rice like a dark enchantment. Salty as the sea, dark as a Dementor\'s cloak, fermented through ancient Eastern magic unknown to European wizardkind. The darkness begins here!'
      },
      {
        name: 'Vinegar',
        clue: 'Add a sharp, stinging splash of this tongue-curling sour potion that makes your face twist like you\'ve bitten into a Puking Pastille! Clear yet vicious, acidic as a harsh word, this preserved liquid bites back harder than a Cornish Pixie!'
      },
      {
        name: 'Cola',
        clue: 'Pour in this bubbling Muggle darkness beloved in their moving picture houses - sweet yet sinister, fizzing like a cauldron on the boil! Dark as midnight in the dungeons, bubbly as a witch\'s cackle, sticky-sweet as a trap for the unwary!'
      },
      {
        name: 'Tamarind Juice',
        clue: 'Stir in this tangy brown extract born from twisted pods that grow in faraway lands where magic tastes different. Sour enough to pucker your lips like Skele-Gro, thick as a curse, this ancient ingredient deepens the darkness of eternal sleep!'
      },
      {
        name: 'Chili Sauce',
        clue: 'Finally, ignite your deadly brew with exactly five drops of this fiery crimson heat - liquid flames that burn like Fiendfyre on the tongue! Red as danger, hot as a Hungarian Horntail\'s breath, this final touch seals the spell of eternal slumber!'
      },
    ],
    instructions: [],
  },
];

export async function GET() {
  try {
    // Get or create houses configuration
    const housesRef = adminDb.collection('potions-config').doc('houses');
    const housesDoc = await housesRef.get();

    let houses;
    if (!housesDoc.exists) {
      // Initialize with default empty codes
      houses = [
        { house: 'gryffindor', code: '', assignedRecipeId: null, isActive: true },
        { house: 'slytherin', code: '', assignedRecipeId: null, isActive: true },
        { house: 'hufflepuff', code: '', assignedRecipeId: null, isActive: true },
        { house: 'ravenclaw', code: '', assignedRecipeId: null, isActive: true },
      ];
      await housesRef.set({ houses });
    } else {
      houses = housesDoc.data()?.houses || [];
    }

    // Get or create recipes
    const recipesRef = adminDb.collection('potions-config').doc('recipes');
    const recipesDoc = await recipesRef.get();

    let recipes;
    if (!recipesDoc.exists) {
      recipes = defaultRecipes;
      await recipesRef.set({ recipes });
    } else {
      recipes = recipesDoc.data()?.recipes || defaultRecipes;
    }

    const adminState: PotionsAdminState = {
      houses,
      recipes,
      lastUpdated: Date.now(),
    };

    return NextResponse.json(adminState);
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
