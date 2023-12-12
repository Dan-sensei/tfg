// seed.ts
import { PrismaClient } from '@prisma/client';
import prisma from '../utils/db';

export default function SeedDb() {
    async function postSeed() {
        "use server"

        await prisma.college.create({
            data: {
                name: 'Universidad de Alicante',
            },
        });
        await prisma.category.createMany({
            data: [
                { name: 'Investigación' },
                { name: 'Entretenimiento digital' },
                { name: 'Desarrollo de Software' },
                { name: 'Ciencia de Datos' },
                { name: 'Diseño Gráfico' },
                { name: 'Ciberseguridad' }, 
                { name: 'Inteligencia Artificial' },
                { name: 'Medio Ambiente' },
                { name: 'Salud y Bienestar' },
                { name: 'Negocios y Finanzas' }
            ],
          });

        await prisma.gradeMaster.createMany({
            data: [
                { name: 'Ingeniería Civil', collegeId: 1 },
                { name: 'Ingeniería Mecánica', collegeId : 1 },
                { name: 'Ingeniería Eléctrica', collegeId : 1 },
                { name: 'Ingeniería Informática', collegeId : 1 },
                { name: 'Ingeniería Química', collegeId : 1 },
                { name: 'Ingeniería Aeroespacial', collegeId : 1 },
                { name: 'Ingeniería Biomédica', collegeId : 1 },
                { name: 'Ingeniería Ambiental', collegeId : 1 },
                { name: 'Ingeniería de Materiales', collegeId : 1 },
                { name: 'Ingeniería Industrial', collegeId : 1 },
                { name: 'Ingeniería Multimedia', collegeId : 1 }, // Added 'Ingeniería Multimedia'
                // Add other engineering careers or master's programs as needed
            ],
          });
        await prisma.tFG.createMany({
            data: [
                {
                thumbnail: 'https://media.discordapp.net/attachments/1168174762984484964/1182697011716292678/dan_senssei_make_a_empty_csgo_level_in_2d_pixel_art_0c2bc82a-7951-4572-a61b-0bde01344e1b.png?ex=6585a36d&is=65732e6d&hm=749189cbaf2c7e3891649a2bd7067214f21905311c74acb28f6416907d0cd3f4&=&format=webp&quality=lossless&width=1044&height=585',
                banner: 'https://media.discordapp.net/attachments/1168174762984484964/1182697011716292678/dan_senssei_make_a_empty_csgo_level_in_2d_pixel_art_0c2bc82a-7951-4572-a61b-0bde01344e1b.png?ex=6585a36d&is=65732e6d&hm=749189cbaf2c7e3891649a2bd7067214f21905311c74acb28f6416907d0cd3f4&=&format=webp&quality=lossless&width=1044&height=585',
                title: 'Innovative Solutions for Sustainable Agriculture',
                author: 'Elena Rodriguez',
                tutor: 'Dr. Alejandro Fernandez',
                content: 'Explore cutting-edge solutions and technologies for sustainable agriculture in this comprehensive research paper.',
                pages: Math.floor(Math.random() * 100) + 1, // Random number of pages
                documentLink: 'URL to Document 1',
                tags: ['Agriculture', 'Sustainability', 'Technology'],
                categoryId: Math.floor(Math.random() * 10) + 1, // Random categoryId in the range 1 to 10
                gradeId: Math.floor(Math.random() * 10) + 1, // Random gradeId in the range 1 to 10
                },
                {
                thumbnail: 'https://media.discordapp.net/attachments/1168174762984484964/1182682946486927472/dan_senssei_make_a_empty_super_mario_bros_level_in_2d_pixel_art_af96d476-8b00-4f04-93de-94d59c2014c2.png?ex=65859653&is=65732153&hm=4b23b74d51bbd35852a0e329185476d7674a5a721190492d13de51b7d9315b62&=&format=webp&quality=lossless&width=1044&height=585',
                banner: 'https://media.discordapp.net/attachments/1168174762984484964/1182682946486927472/dan_senssei_make_a_empty_super_mario_bros_level_in_2d_pixel_art_af96d476-8b00-4f04-93de-94d59c2014c2.png?ex=65859653&is=65732153&hm=4b23b74d51bbd35852a0e329185476d7674a5a721190492d13de51b7d9315b62&=&format=webp&quality=lossless&width=1044&height=585',
                title: 'Advancements in Neural Network Algorithms',
                author: 'Jonathan Williams',
                tutor: 'Prof. Katherine Johnson',
                content: 'Delve into the latest developments in neural network algorithms, exploring their applications and potential impact.',
                pages: Math.floor(Math.random() * 100) + 1, // Random number of pages
                documentLink: 'URL to Document 2',
                tags: ['Neural Networks', 'Algorithms', 'Artificial Intelligence'],
                categoryId: Math.floor(Math.random() * 10) + 1, // Random categoryId in the range 1 to 10
                gradeId: Math.floor(Math.random() * 10) + 1, // Random gradeId in the range 1 to 10
              },
              {
                thumbnail: 'https://media.discordapp.net/attachments/1168174762984484964/1181291345743183932/dan_senssei_make_the_mythic_creature_the_grinch_happy_c9c2312d-3ee5-4f63-8f73-37657799f3ae.png?ex=6580864c&is=656e114c&hm=54cd212bdcd53c0b9987fc3b97a0dd1290237d81f1a1ac6af011a1ef5863a35a&=&format=webp&quality=lossless',
                banner: 'https://media.discordapp.net/attachments/1168174762984484964/1181291345743183932/dan_senssei_make_the_mythic_creature_the_grinch_happy_c9c2312d-3ee5-4f63-8f73-37657799f3ae.png?ex=6580864c&is=656e114c&hm=54cd212bdcd53c0b9987fc3b97a0dd1290237d81f1a1ac6af011a1ef5863a35a&=&format=webp&quality=lossless',
                title: 'Exploring Dark Matter in the Universe',
                author: 'Sophia Chen',
                tutor: 'Dr. Michael Turner',
                content: 'Join an exploration of the mysteries of dark matter, its properties, and its role in the vast cosmic web of the universe.',
                pages: Math.floor(Math.random() * 100) + 1, // Random number of pages
                documentLink: 'URL to Document 3',
                tags: ['Astrophysics', 'Dark Matter', 'Cosmology'],
                categoryId: Math.floor(Math.random() * 10) + 1, // Random categoryId in the range 1 to 10
                gradeId: Math.floor(Math.random() * 10) + 1, // Random gradeId in the range 1 to 10
              },
              {
                thumbnail: 'https://media.discordapp.net/attachments/1168174762984484964/1179988088102076506/dan_senssei_a_happy_will_smith_hugging_a_little_dragon_23b38d5d-23d7-48a2-925b-1d51d7646556.png?ex=6585030b&is=65728e0b&hm=5d017bfed2baa7a466ec469d2c65b30b8ee0c79e9f21205b1f03c2aff8e25351&=&format=webp&quality=lossless',
                banner: 'https://media.discordapp.net/attachments/1168174762984484964/1179988088102076506/dan_senssei_a_happy_will_smith_hugging_a_little_dragon_23b38d5d-23d7-48a2-925b-1d51d7646556.png?ex=6585030b&is=65728e0b&hm=5d017bfed2baa7a466ec469d2c65b30b8ee0c79e9f21205b1f03c2aff8e25351&=&format=webp&quality=lossless',
                title: 'The Impact of Renewable Energy on Global Carbon Emissions',
                author: 'Carlos Martinez',
                tutor: 'Dr. Emily Brown',
                content: 'Investigate the influence of renewable energy sources on reducing global carbon emissions and mitigating climate change.',
                pages: Math.floor(Math.random() * 100) + 1,
                documentLink: 'URL to Document 4',
                tags: ['Renewable Energy', 'Climate Change', 'Environmental Science'],
                categoryId: Math.floor(Math.random() * 10) + 1,
                gradeId: Math.floor(Math.random() * 10) + 1,
              },
              {
                thumbnail: 'https://media.discordapp.net/attachments/1168174762984484964/1182775195665174568/dan_senssei_8-bit_pixel_art_dragon_flying_37be0ba6-f501-459f-8379-f8b3a09c9c11.png?ex=6585ec3d&is=6573773d&hm=d2dfe0a81dd2ea653d069e1b5353137784a96c1a4c90ec43a276c7a014c205bc&=&format=webp&quality=lossless',
                banner: 'https://media.discordapp.net/attachments/1168174762984484964/1182775195665174568/dan_senssei_8-bit_pixel_art_dragon_flying_37be0ba6-f501-459f-8379-f8b3a09c9c11.png?ex=6585ec3d&is=6573773d&hm=d2dfe0a81dd2ea653d069e1b5353137784a96c1a4c90ec43a276c7a014c205bc&=&format=webp&quality=lossless',
                title: 'Advances in Quantum Computing Algorithms',
                author: 'Olivia Johnson',
                tutor: 'Prof. Alexander Smith',
                content: 'Explore the latest breakthroughs in quantum computing algorithms and their potential applications in various fields.',
                pages: Math.floor(Math.random() * 100) + 1,
                documentLink: 'URL to Document 5',
                tags: ['Quantum Computing', 'Algorithms', 'Technology'],
                categoryId: Math.floor(Math.random() * 10) + 1,
                gradeId: Math.floor(Math.random() * 10) + 1,
              },
              {
                thumbnail: 'https://media.discordapp.net/attachments/1168174762984484964/1179820148312518686/dan_senssei_feudal_japanese_hilltNightredshift._4k_ultrarealist_35669431-9d94-44d4-b95b-38d4a39379b3.png?ex=658466a3&is=6571f1a3&hm=90d97c9d054401baba3f3d73415d85acbc486dda4dc3afbda912705c93c5eca9&=&format=webp&quality=lossless&width=1044&height=447',
                banner: 'https://media.discordapp.net/attachments/1168174762984484964/1179820148312518686/dan_senssei_feudal_japanese_hilltNightredshift._4k_ultrarealist_35669431-9d94-44d4-b95b-38d4a39379b3.png?ex=658466a3&is=6571f1a3&hm=90d97c9d054401baba3f3d73415d85acbc486dda4dc3afbda912705c93c5eca9&=&format=webp&quality=lossless&width=1044&height=447',
                title: 'Unraveling the Genetic Basis of Rare Diseases',
                author: 'Isabella Garcia',
                tutor: 'Dr. Christopher Miller',
                content: 'Dive into the genetic complexities underlying rare diseases, exploring potential diagnostic and therapeutic avenues.',
                pages: Math.floor(Math.random() * 100) + 1,
                documentLink: 'URL to Document 6',
                tags: ['Genetics', 'Rare Diseases', 'Medical Research'],
                categoryId: Math.floor(Math.random() * 10) + 1,
                gradeId: Math.floor(Math.random() * 10) + 1,
              },
              {
                thumbnail: 'https://media.discordapp.net/attachments/1168174762984484964/1179801679932170270/dan_senssei_feudal_japanese_environment_redshift._4k_ultrareali_fcbf9d68-a07d-4e4c-b9fd-1e4decf33729.png?ex=65845570&is=6571e070&hm=0b2f9bfb599dd3213362f311a119b229bf0df5de25f4f20285ecf3001210b800&=&format=webp&quality=lossless',
                banner: 'https://media.discordapp.net/attachments/1168174762984484964/1179801679932170270/dan_senssei_feudal_japanese_environment_redshift._4k_ultrareali_fcbf9d68-a07d-4e4c-b9fd-1e4decf33729.png?ex=65845570&is=6571e070&hm=0b2f9bfb599dd3213362f311a119b229bf0df5de25f4f20285ecf3001210b800&=&format=webp&quality=lossless',
                title: 'Smart Cities: Enhancing Urban Living with IoT',
                author: 'Lucas Anderson',
                tutor: 'Prof. Samantha White',
                content: 'Examine the integration of Internet of Things (IoT) technologies in urban environments to create smarter and more efficient cities.',
                pages: Math.floor(Math.random() * 100) + 1,
                documentLink: 'URL to Document 7',
                tags: ['Smart Cities', 'IoT', 'Urban Planning'],
                categoryId: Math.floor(Math.random() * 10) + 1,
                gradeId: Math.floor(Math.random() * 10) + 1,
              },
              {
                thumbnail: 'https://media.discordapp.net/attachments/1168174762984484964/1178067935194005564/dan_senssei_disney_style_pinguin_redshift_4k_greetings_to_camer_54d39237-b485-4dc0-a20f-808b89f392f4.png?ex=657e06c3&is=656b91c3&hm=01527fface2b5a1e7f408f63ebe1223333e4492aa7f995047172c19a63fb146a&=&format=webp&quality=lossless',
                banner: 'https://media.discordapp.net/attachments/1168174762984484964/1178067935194005564/dan_senssei_disney_style_pinguin_redshift_4k_greetings_to_camer_54d39237-b485-4dc0-a20f-808b89f392f4.png?ex=657e06c3&is=656b91c3&hm=01527fface2b5a1e7f408f63ebe1223333e4492aa7f995047172c19a63fb146a&=&format=webp&quality=lossless',
                title: 'The Evolutionary History of Marsupials',
                author: 'Emma Davis',
                tutor: 'Dr. Richard Thompson',
                content: 'Uncover the evolutionary journey of marsupials, from their origins to the diverse species found in different regions of the world.',
                pages: Math.floor(Math.random() * 100) + 1,
                documentLink: 'URL to Document 8',
                tags: ['Evolution', 'Marsupials', 'Biology'],
                categoryId: Math.floor(Math.random() * 10) + 1,
                gradeId: Math.floor(Math.random() * 10) + 1,
              },
              {
                thumbnail: 'https://media.discordapp.net/attachments/1166741839437643876/1174452596254199948/dan_senssei_make_a_representation_of_the_pathophysiology_of_par_491871f7-d433-4616-b600-235062b58354.png?ex=658354b7&is=6570dfb7&hm=e728eb26f00aeb8063955b7e373c273c39013f3b02a8b24f041d7aec7548443a&=&format=webp&quality=lossless',
                banner: 'https://media.discordapp.net/attachments/1166741839437643876/1174452596254199948/dan_senssei_make_a_representation_of_the_pathophysiology_of_par_491871f7-d433-4616-b600-235062b58354.png?ex=658354b7&is=6570dfb7&hm=e728eb26f00aeb8063955b7e373c273c39013f3b02a8b24f041d7aec7548443a&=&format=webp&quality=lossless',
                title: 'Bio-inspired Robotics: Mimicking Nature in Machines',
                author: 'Natalie Turner',
                tutor: 'Prof. David Williams',
                content: 'Explore the field of bio-inspired robotics, where machines are designed to mimic the behaviors and structures found in nature.',
                pages: Math.floor(Math.random() * 100) + 1,
                documentLink: 'URL to Document 9',
                tags: ['Robotics', 'Bio-inspiration', 'Engineering'],
                categoryId: Math.floor(Math.random() * 10) + 1,
                gradeId: Math.floor(Math.random() * 10) + 1,
              },
              {
                thumbnail: 'https://media.discordapp.net/attachments/1166741839437643876/1174452814274109520/dan_senssei_mycobacterium_tuberculosi_c411d84e-12b5-40a4-b719-8f082acce32b.png?ex=658354eb&is=6570dfeb&hm=ca2c602308486a1df4a15cec6edbe6558005689b8e0fead3377e20724027b01e&=&format=webp&quality=lossless',
                banner: 'https://media.discordapp.net/attachments/1166741839437643876/1174452814274109520/dan_senssei_mycobacterium_tuberculosi_c411d84e-12b5-40a4-b719-8f082acce32b.png?ex=658354eb&is=6570dfeb&hm=ca2c602308486a1df4a15cec6edbe6558005689b8e0fead3377e20724027b01e&=&format=webp&quality=lossless',
                title: 'Unlocking the Mysteries of Quantum Entanglement',
                author: 'Andrew Mitchell',
                tutor: 'Dr. Sophia Lee',
                content: 'Delve into the fascinating world of quantum entanglement and its implications for quantum communication and computation.',
                pages: Math.floor(Math.random() * 100) + 1,
                documentLink: 'URL to Document 10',
                tags: ['Quantum Physics', 'Entanglement', 'Information Science'],
                categoryId: Math.floor(Math.random() * 10) + 1,
                gradeId: Math.floor(Math.random() * 10) + 1,
              },
              {
                thumbnail: 'https://media.discordapp.net/attachments/1166741839437643876/1174452925729353788/dan_senssei_make_a_representation_of_the_pathophysiology_of_par_ac1f72da-823c-4b35-811f-f1ed1ca73c0f.png?ex=65835505&is=6570e005&hm=033d349e5c72f0e5ac6652b9da2ec9240355f4cb177d3d6d49ff9b1cf9faab65&=&format=webp&quality=lossless',
                banner: 'https://media.discordapp.net/attachments/1166741839437643876/1174452925729353788/dan_senssei_make_a_representation_of_the_pathophysiology_of_par_ac1f72da-823c-4b35-811f-f1ed1ca73c0f.png?ex=65835505&is=6570e005&hm=033d349e5c72f0e5ac6652b9da2ec9240355f4cb177d3d6d49ff9b1cf9faab65&=&format=webp&quality=lossless',
                title: 'Designing Sustainable Urban Transportation Systems',
                author: 'Sophie Anderson',
                tutor: 'Prof. Daniel Lopez',
                content: 'Address the challenges of urban transportation sustainability, proposing innovative solutions for reducing environmental impact.',
                pages: Math.floor(Math.random() * 100) + 1,
                documentLink: 'URL to Document 11',
                tags: ['Urban Transportation', 'Sustainability', 'City Planning'],
                categoryId: Math.floor(Math.random() * 10) + 1,
                gradeId: Math.floor(Math.random() * 10) + 1,
              },
              {
                thumbnail: 'https://media.discordapp.net/attachments/1166741373219778586/1174461580218470400/dan_senssei_gameplay_scenes_of_pixel_art_game_2d_b633992e-49bd-44c4-b553-4c58a2d1b5f0.png?ex=65835d15&is=6570e815&hm=e959ddc3dbac589f3f5e9cbec4c674389687e9e205cb0fce8a039250b8d9382e&=&format=webp&quality=lossless&width=1044&height=696',
                banner: 'https://media.discordapp.net/attachments/1166741373219778586/1174461580218470400/dan_senssei_gameplay_scenes_of_pixel_art_game_2d_b633992e-49bd-44c4-b553-4c58a2d1b5f0.png?ex=65835d15&is=6570e815&hm=e959ddc3dbac589f3f5e9cbec4c674389687e9e205cb0fce8a039250b8d9382e&=&format=webp&quality=lossless&width=1044&height=696',
                title: 'The Role of Microorganisms in Soil Health',
                author: 'Oliver Brown',
                tutor: 'Dr. Maria Rodriguez',
                content: 'Investigate the intricate relationship between microorganisms and soil health, exploring the impact on plant growth and ecosystems.',
                pages: Math.floor(Math.random() * 100) + 1,
                documentLink: 'URL to Document 12',
                tags: ['Microbiology', 'Soil Health', 'Environmental Science'],
                categoryId: Math.floor(Math.random() * 10) + 1,
                gradeId: Math.floor(Math.random() * 10) + 1,
              },
              {
                thumbnail: 'https://media.discordapp.net/attachments/1166741373219778586/1174462086395473930/dan_senssei_gameplay_scenes_of_pixel_art_game_2d_2c41a2dd-786c-4fe0-8d55-29be86432871.png?ex=65835d8d&is=6570e88d&hm=e2558518e922b7303253ce84358a8725d623949cdf140e2e0ec93607e6d817ee&=&format=webp&quality=lossless&width=1044&height=696',
                banner: 'https://media.discordapp.net/attachments/1166741373219778586/1174462086395473930/dan_senssei_gameplay_scenes_of_pixel_art_game_2d_2c41a2dd-786c-4fe0-8d55-29be86432871.png?ex=65835d8d&is=6570e88d&hm=e2558518e922b7303253ce84358a8725d623949cdf140e2e0ec93607e6d817ee&=&format=webp&quality=lossless&width=1044&height=696',
                title: 'Artificial Intelligence in Healthcare: Opportunities and Challenges',
                author: 'Isaac Martinez',
                tutor: 'Prof. Emily Clark',
                content: 'Examine the potential of artificial intelligence in revolutionizing healthcare, while addressing ethical and privacy concerns.',
                pages: Math.floor(Math.random() * 100) + 1,
                documentLink: 'URL to Document 13',
                tags: ['Artificial Intelligence', 'Healthcare', 'Ethics'],
                categoryId: Math.floor(Math.random() * 10) + 1,
                gradeId: Math.floor(Math.random() * 10) + 1,
              },
              {
                thumbnail: 'https://media.discordapp.net/attachments/1166741373219778586/1182776717530648597/dan_senssei_Kratos_from_God_of_War._Ultra_realistic_redshift_43580d63-1971-494c-ab74-a5b36b247ea3.png?ex=6585eda8&is=657378a8&hm=245832d854bbe56f8cb6e9ceb4dc6ab3831080d43a3b6b4cb4b4939ee30cd901&=&format=webp&quality=lossless',
                banner: 'https://media.discordapp.net/attachments/1166741373219778586/1182776717530648597/dan_senssei_Kratos_from_God_of_War._Ultra_realistic_redshift_43580d63-1971-494c-ab74-a5b36b247ea3.png?ex=6585eda8&is=657378a8&hm=245832d854bbe56f8cb6e9ceb4dc6ab3831080d43a3b6b4cb4b4939ee30cd901&=&format=webp&quality=lossless',
                title: 'Exploring the Interplay of Art and Technology in Virtual Reality',
                author: 'Ava Thompson',
                tutor: 'Dr. Benjamin Taylor',
                content: 'Investigate the intersection of art and technology through the lens of virtual reality, exploring creative possibilities and challenges.',
                pages: Math.floor(Math.random() * 100) + 1,
                documentLink: 'URL to Document 14',
                tags: ['Virtual Reality', 'Art and Technology', 'Creative Expression'],
                categoryId: Math.floor(Math.random() * 10) + 1,
                gradeId: Math.floor(Math.random() * 10) + 1,
              },
              {
                thumbnail: 'https://media.discordapp.net/attachments/1166741373219778586/1172355309835133009/dan_senssei_Banner_for_a_thesis_project_based_on_a_videogame_a332bcf9-1fa4-4c5d-a885-8a2aedbabb7f.png?ex=6584edf7&is=657278f7&hm=cc21fdd298709a10ef58b311e2a7fc29aedaf6aa6099e69a27c1df33cf734edd&=&format=webp&quality=lossless&width=1044&height=522',
                banner: 'https://media.discordapp.net/attachments/1166741373219778586/1172355309835133009/dan_senssei_Banner_for_a_thesis_project_based_on_a_videogame_a332bcf9-1fa4-4c5d-a885-8a2aedbabb7f.png?ex=6584edf7&is=657278f7&hm=cc21fdd298709a10ef58b311e2a7fc29aedaf6aa6099e69a27c1df33cf734edd&=&format=webp&quality=lossless&width=1044&height=522',
                title: 'Urban Biodiversity Conservation: Strategies for Green Cities',
                author: 'Mia Davis',
                tutor: 'Prof. Christopher Turner',
                content: 'Explore strategies for conserving urban biodiversity, promoting green spaces, and enhancing the ecological balance in cities.',
                pages: Math.floor(Math.random() * 100) + 1,
                documentLink: 'URL to Document 15',
                tags: ['Biodiversity', 'Urban Conservation', 'Ecology'],
                categoryId: Math.floor(Math.random() * 10) + 1,
                gradeId: Math.floor(Math.random() * 10) + 1,
              },
              {
                thumbnail: 'https://media.discordapp.net/attachments/1166741373219778588/1182776936083247174/dan_senssei_Ak-47_blue_gem_from_counter_strike_a57f91da-e03f-4c12-843b-c047c253c2d0.png?ex=6585eddc&is=657378dc&hm=b38693fc10375058280eba327f460babd04ae6aea45de1e788a7523892ccf9fe&=&format=webp&quality=lossless',
                banner: 'https://media.discordapp.net/attachments/1166741373219778588/1182776936083247174/dan_senssei_Ak-47_blue_gem_from_counter_strike_a57f91da-e03f-4c12-843b-c047c253c2d0.png?ex=6585eddc&is=657378dc&hm=b38693fc10375058280eba327f460babd04ae6aea45de1e788a7523892ccf9fe&=&format=webp&quality=lossless',
                title: 'The Future of Space Exploration: Beyond Our Solar System',
                author: 'Noah Garcia',
                tutor: 'Dr. Sophia Turner',
                content: 'Envision the future of space exploration as we venture beyond our solar system, discussing challenges, possibilities, and potential discoveries.',
                pages: Math.floor(Math.random() * 100) + 1,
                documentLink: 'URL to Document 16',
                tags: ['Space Exploration', 'Astronomy', 'Interstellar Travel'],
                categoryId: Math.floor(Math.random() * 10) + 1,
                gradeId: Math.floor(Math.random() * 10) + 1,
              },
              {
                thumbnail: 'https://media.discordapp.net/attachments/1166741373219778588/1179624595809128509/dan_senssei_room_73d565d2-2cfe-404c-8581-b7b30fca1a46.png?ex=6583b084&is=65713b84&hm=c66867498c2c5924f905b41f1f714058183ff2eec7575fad741d485dd07e9c6e&=&format=webp&quality=lossless&width=1044&height=696',
                banner: 'https://media.discordapp.net/attachments/1166741373219778588/1179624595809128509/dan_senssei_room_73d565d2-2cfe-404c-8581-b7b30fca1a46.png?ex=6583b084&is=65713b84&hm=c66867498c2c5924f905b41f1f714058183ff2eec7575fad741d485dd07e9c6e&=&format=webp&quality=lossless&width=1044&height=696',
                title: 'The Psychology of Decision-Making: Insights from Behavioral Economics',
                author: 'Ethan Wilson',
                tutor: 'Prof. Emma Davis',
                content: 'Examine the psychological aspects of decision-making through the lens of behavioral economics, exploring biases, heuristics, and rationality.',
                pages: Math.floor(Math.random() * 100) + 1,
                documentLink: 'URL to Document 17',
                tags: ['Decision-Making', 'Behavioral Economics', 'Psychology'],
                categoryId: Math.floor(Math.random() * 10) + 1,
                gradeId: Math.floor(Math.random() * 10) + 1,
              },
              {
                thumbnail: 'https://media.discordapp.net/attachments/1166741373219778588/1182777117000355870/dan_senssei_Chihuahua_with_mexican_hat_eating_a_kebab_b5210d01-1d44-4a7a-969e-cecd76cb7052.png?ex=6585ee07&is=65737907&hm=b835cbe04097760c07665bd21f35d2a28a9680b308b8fc7024ca5b4e2d6ee57f&=&format=webp&quality=lossless',
                banner: 'https://media.discordapp.net/attachments/1166741373219778588/1182777117000355870/dan_senssei_Chihuahua_with_mexican_hat_eating_a_kebab_b5210d01-1d44-4a7a-969e-cecd76cb7052.png?ex=6585ee07&is=65737907&hm=b835cbe04097760c07665bd21f35d2a28a9680b308b8fc7024ca5b4e2d6ee57f&=&format=webp&quality=lossless',
                title: 'Innovations in 3D Printing: Applications Across Industries',
                author: 'Liam Harris',
                tutor: 'Dr. Olivia Martinez',
                content: 'Explore the latest innovations in 3D printing technology and its diverse applications across industries, from healthcare to manufacturing.',
                pages: Math.floor(Math.random() * 100) + 1,
                documentLink: 'URL to Document 18',
                tags: ['3D Printing', 'Technology', 'Innovation'],
                categoryId: Math.floor(Math.random() * 10) + 1,
                gradeId: Math.floor(Math.random() * 10) + 1,
              },
            ],
          });
    }

    return (
        <div className='m-5'>
        <form action={postSeed}>
            <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            >
            Seed Database
            </button>
        </form>
        </div>
    );
}

