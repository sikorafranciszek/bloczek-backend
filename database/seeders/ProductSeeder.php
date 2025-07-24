<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Rangi
        $ranks = [
            [
                'id' => 1,
                'name' => 'VIP',
                'price' => 9.99,
                'original_price' => null,
                'image_url' => 'https://pub-123456789.r2.dev/products/vip-rank.png',
                'duration' => '30 dni',
                'short_desc' => 'Najtańsza spośród rang premium, zawiera podstawowe udogodnienia ułatwiające rozgrywkę!',
                'features' => [
                    '/kit - zestaw dedykowany dla rangi VIP',
                    '/wb - przenośny crafting table',
                    '/market - wystawienie do 5 przedmiotów',
                    '/sethome - ustawienie do 3 domów',
                    '/tpa - brak cooldownu na teleportację',
                    'Prefix VIP na chatcie i przy nicku',
                ],
                'color' => 'green',
                'category' => 'ranks',
            ],
            [
                'id' => 2,
                'name' => 'SVIP',
                'price' => 19.99,
                'original_price' => null,
                'image_url' => 'https://pub-123456789.r2.dev/products/svip-rank.png',
                'duration' => '30 dni',
                'short_desc' => 'Ranga premium, która znacznie umili twój czas spędzany na serwerze! Znajdziesz tu jeszcze więcej uprawnień niż w randze VIP!',
                'features' => [
                    '/kit - zestaw dedykowany dla rangi SVIP',
                    '/wb - przenośny crafting table',
                    '/ec - przenośny ender chest',
                    '/repair - naprawa przedmiotu w ręce',
                    '/market - wystawienie do 10 przedmiotów',
                    '/sethome - ustawienie do 4 domów',
                    '/tpa - brak cooldownu na teleportację',
                    'Wyróżniający się prefix SVIP',
                ],
                'color' => 'blue',
                'category' => 'ranks',
            ],
            [
                'id' => 3,
                'name' => 'MVIP',
                'price' => 29.99,
                'original_price' => null,
                'image_url' => 'https://pub-123456789.r2.dev/products/mvip-rank.png',
                'duration' => '30 dni',
                'short_desc' => 'Dzięki tej randze premium twoje szanse na zdobycie przewagi nad innymi graczami znacznie wzrosną!',
                'features' => [
                    '/kit - zestaw dedykowany dla rangi MVIP',
                    '/wb - przenośny crafting table',
                    '/ec - przenośny ender chest',
                    '/repair - naprawa przedmiotu w ręce',
                    '/repairall - naprawa wszystkich przedmiotów',
                    '/market - wystawienie do 15 przedmiotów',
                    '/sethome - ustawienie do 5 domów',
                    '/tpa - brak cooldownu na teleportację',
                    'Wyróżniający się prefix MVIP',
                ],
                'color' => 'purple',
                'category' => 'ranks',
            ],
            [
                'id' => 4,
                'name' => 'BLOCZEK',
                'price' => 49.99,
                'original_price' => null,
                'image_url' => 'https://pub-123456789.r2.dev/products/bloczek-rank.png',
                'duration' => '30 dni',
                'short_desc' => 'Najbardziej prestiżowa spośród rang! Posiadasz dostęp do wszystkich funkcji zapewnionych przez serwer!',
                'features' => [
                    '/kit - zestaw dedykowany dla rangi BLOCZEK',
                    '/wb - przenośny crafting table',
                    '/ec - przenośny ender chest',
                    '/repair - naprawa przedmiotu w ręce',
                    '/repairall - naprawa wszystkich przedmiotów',
                    '/market - wystawienie do 20 przedmiotów',
                    '/sethome - ustawienie do 7 domów',
                    '/tpa - brak cooldownu na teleportację',
                    'Gradientowy unikalny prefix BLOCZEK',
                    'Brak cooldownu na pisanie na chatcie',
                    'x2 razy więcej monet',
                    'Unikalna ranga na Discordzie',
                    'Globalna wiadomość przy wejściu',
                ],
                'color' => 'orange',
                'category' => 'ranks',
                'featured' => true,
            ],
        ];

        // Klucze
        $keys = [
            [
                'id' => 5,
                'name' => 'Epickie Klucze',
                'price' => 0.69,
                'image_url' => 'https://pub-123456789.r2.dev/products/epic-key.png',
                'description' => 'Pozwalają na otworzenie Epickiej Skrzyni z podstawowymi przedmiotami pomagającymi w rozwoju!',
                'color' => 'from-green-500 to-emerald-500',
                'category' => 'keys',
            ],
            [
                'id' => 6,
                'name' => 'Mityczne Klucze',
                'price' => 1.99,
                'image_url' => 'https://pub-123456789.r2.dev/products/mythic-key.png',
                'description' => 'Pozwalają na otworzenie Mitycznej Skrzyni z lepszymi przedmiotami przyspieszającymi rozgrywkę!',
                'color' => 'from-blue-500 to-cyan-500',
                'category' => 'keys',
            ],
            [
                'id' => 7,
                'name' => 'Legendarne Klucze',
                'price' => 4.99,
                'image_url' => 'https://pub-123456789.r2.dev/products/legendary-key.png',
                'description' => 'Otwierając Legendarną Skrzynię możesz zdobyć bardzo wartościowe przedmioty pożądane przez wszystkich!',
                'color' => 'from-purple-500 to-pink-500',
                'category' => 'keys',
            ],
            [
                'id' => 8,
                'name' => 'Mystery Box',
                'price' => 19.99,
                'image_url' => 'https://pub-123456789.r2.dev/products/mystery-box.png',
                'description' => 'W Mystery Boxie znajdziesz tylko najrzadsze przedmioty posiadające dużą wartość na rynku serwerowym!',
                'color' => 'from-orange-500 to-red-500',
                'category' => 'keys',
            ],
        ];

        // Zestawy
        $bundles = [
            [
                'id' => 9,
                'name' => 'Zestaw VIPa',
                'price' => 19.99,
                'original_price' => 27.0,
                'image_url' => 'https://pub-123456789.r2.dev/products/vip-bundle.png',
                'description' => 'Potrzebujesz dobrego startu? Ten zestaw wspomoże cię poprzez rangę VIP i kilka kluczy!',
                'contents' => ['Ranga VIP 30d', 'Epickie Klucze x16', 'Mityczne Klucze x3'],
                'color' => 'green',
                'category' => 'bundles',
                'discount' => 26,
            ],
            [
                'id' => 10,
                'name' => 'Zestaw Stiva',
                'price' => 39.99,
                'original_price' => 51.83,
                'image_url' => 'https://pub-123456789.r2.dev/products/steve-bundle.png',
                'description' => 'Podstawowe klucze i VIP to za mało? Ten zestaw wspomoże cię poprzez rangę SVIP i mityczne klucze!',
                'contents' => ['Ranga SVIP 30d', 'Mityczne Klucze x16'],
                'color' => 'blue',
                'category' => 'bundles',
                'discount' => 23,
            ],
            [
                'id' => 11,
                'name' => 'Zestaw Bloczka',
                'price' => 99.99,
                'original_price' => 149.79,
                'image_url' => 'https://pub-123456789.r2.dev/products/bloczek-bundle.png',
                'description' => 'Rozpocznij rozgrywkę w wielkim stylu z najbardziej PRESTIŻOWĄ rangą i Legendarnymi Kluczami!',
                'contents' => ['Ranga BLOCZEK 30d', 'Legendarne Klucze x20'],
                'color' => 'orange',
                'category' => 'bundles',
                'discount' => 33,
                'popular' => true,
            ],
            [
                'id' => 12,
                'name' => 'Zestaw Omnibusa',
                'price' => 199.99,
                'original_price' => 279.56,
                'image_url' => 'https://pub-123456789.r2.dev/products/omnibus-bundle.png',
                'description' => 'Potrzebujesz dużoooo itemów? Zawiera najlepsze klucze do Mystery Boxów i Legendarnych Skrzyń!',
                'contents' => ['Klucze Mystery Boxa x4', 'Klucze Legendarne x40'],
                'color' => 'purple',
                'category' => 'bundles',
                'discount' => 28,
                'best_offer' => true,
            ],
        ];

        // Połącz wszystkie produkty
        $allProducts = array_merge($ranks, $keys, $bundles);

        foreach ($allProducts as $product) {
            Product::create($product);
        }
    }
}
