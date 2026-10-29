export interface CityData {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  area: string;
  population: string;
  history: string;
  landmarks: string[];
  geography: string;
  funFacts: string[];
}

export interface StateData {
  name: string;
  capital: string;
  area: string;
  population: string;
  languages: string[];
  description: string;
  cities: CityData[];
  funFact: string;
}

export const educationalData: Record<string, StateData> = {
  "Andhra Pradesh": {
    name: "Andhra Pradesh",
    capital: "Amaravati",
    area: "162,975 km²",
    population: "49.57 Million",
    languages: ["Telugu", "Urdu"],
    description: "Known as the 'Rice Bowl of India', Andhra Pradesh is located on the southeastern coast of India. It has a rich cultural heritage, famous temples, and a long coastline along the Bay of Bengal.",
    funFact: "Andhra Pradesh has the second-longest coastline in India, stretching over 974 kilometers!",
    cities: [
      {
        name: "Visakhapatnam",
        coordinates: [83.2185, 17.6868],
        area: "681.96 km²",
        population: "1.73 Million",
        history: "A historical port city named after Lord Visakha (the God of Valor). It was part of the ancient Kalinga Kingdom and later ruled by the Eastern Chalukyas, Mughals, and British.",
        landmarks: ["Kailasagiri Hill Park", "INS Kursura Submarine Museum", "Araku Valley", "Yarada Beach"],
        geography: "Nestled between the Eastern Ghats and the Bay of Bengal. It is a natural harbor surrounded by scenic hills like Dolphin's Nose.",
        funFacts: [
          "It is the only natural harbor on the eastern coast of India.",
          "It hosts South Asia's first submarine museum inside a real decommissioned submarine!"
        ]
      },
      {
        name: "Amaravati",
        coordinates: [80.3600, 16.5730],
        area: "217.2 km²",
        population: "Approx. 150,000",
        history: "A highly revered Buddhist site dates back to the 2nd Century BCE. It was the capital of the Satavahana dynasty. The great Amaravati Stupa was built here.",
        landmarks: ["Amaravati Stupa", "Dhyana Buddha Statue", "Amareshwara Temple"],
        geography: "Situated on the banks of the Krishna River, featuring fertile plains ideal for agriculture.",
        funFacts: [
          "Named after the mythical city of Indra, the king of gods.",
          "It has been a major center of learning and Buddhism since ancient times, visited by Chinese traveler Xuanzang."
        ]
      }
    ]
  },
  "Arunachal Pradesh": {
    name: "Arunachal Pradesh",
    capital: "Itanagar",
    area: "83,743 km²",
    population: "1.38 Million",
    languages: ["English", "Nyishi", "Adi", "Monpa"],
    description: "The 'Land of the Rising Sun' is India's easternmost state, located in the Eastern Himalayas. It is known for its pristine forests, deep valleys, and diverse indigenous tribes.",
    funFact: "Arunachal Pradesh is the first place in India to greet the morning sun rays!",
    cities: [
      {
        name: "Itanagar",
        coordinates: [93.6053, 27.0844],
        area: "21.09 km²",
        population: "Approx. 73,000",
        history: "Named after the historical Ita Fort ('Fort of Bricks') built in the 14th-15th century by the Jitari Dynasty.",
        landmarks: ["Ita Fort", "Ganga Lake (Gyakar Sinyi)", "Itanagar Buddhist Gompa", "Jawaharlal Nehru State Museum"],
        geography: "Located in the foothills of the Himalayas. Features a warm sub-tropical climate with lush green hillocks.",
        funFacts: [
          "The Ita Fort was built using more than 8 million bricks!",
          "Ganga Lake has no natural outlet, and its water is green due to local vegetation."
        ]
      }
    ]
  },
  "Assam": {
    name: "Assam",
    capital: "Dispur",
    area: "78,438 km²",
    population: "31.20 Million",
    languages: ["Assamese", "Bodo", "Bengali"],
    description: "Famous for its rich tea plantations, silk, and the mighty Brahmaputra River. It is home to the one-horned Indian rhinoceros.",
    funFact: "Assam tea is globally famous and is grown in the largest tea-growing region in the entire world!",
    cities: [
      {
        name: "Guwahati",
        coordinates: [91.7362, 26.1445],
        area: "328 km²",
        population: "1.12 Million",
        history: "Anciently known as Pragjyotishpura (City of Eastern Light). It was the capital of the Kamarupa kingdom. It successfully resisted Mughal conquest under the Ahom general Lachit Borphukan.",
        landmarks: ["Kamakhya Temple", "Umananda Island Temple", "Kaziranga National Park (nearby)", "Guwahati Planetarium"],
        geography: "Lies between the banks of the Brahmaputra River and the foothills of the Shillong plateau.",
        funFacts: [
          "Guwahati has the world's smallest inhabited river island, Umananda Island (also called Peacock Island).",
          "It is the gateway to the entire North-East India region."
        ]
      }
    ]
  },
  "Bihar": {
    name: "Bihar",
    capital: "Patna",
    area: "94,163 km²",
    population: "104.10 Million",
    languages: ["Hindi", "Maithili", "Bhojpuri"],
    description: "One of the oldest continuously inhabited places in the world. It is the birthplace of Buddhism and Jainism, and home to ancient universities like Nalanda.",
    funFact: "The name Bihar is derived from the Sanskrit word 'Vihara', which means Buddhist monastery.",
    cities: [
      {
        name: "Patna",
        coordinates: [85.1376, 25.5941],
        area: "135 km²",
        population: "2.05 Million",
        history: "Anciently called Pataliputra, it was the capital of the Maurya and Gupta Empires. Home to legendary figures like Emperor Ashoka, Chandragupta Maurya, and Aryabhata.",
        landmarks: ["Golghar", "Patna Museum", "Takht Sri Patna Sahib", "Gandhi Sangrahalaya"],
        geography: "Located on the southern bank of the holy river Ganga. Features flat, fertile alluvial plains.",
        funFacts: [
          "Pataliputra was one of the largest cities in the ancient world, bigger than Rome.",
          "Golghar was built in 1786 as a massive granary to prevent famines, shaped like a beehive."
        ]
      }
    ]
  },
  "Chhattisgarh": {
    name: "Chhattisgarh",
    capital: "Raipur",
    area: "135,192 km²",
    population: "29.43 Million",
    languages: ["Chhattisgarhi", "Hindi"],
    description: "A heavily forested state in central India known for its waterfalls, ancient temples, rich tribal culture, and steel production.",
    funFact: "Chhattisgarh is famously known as the 'Dhan ka Katora' (Rice Bowl of Central India) because of the hundreds of traditional rice varieties grown here.",
    cities: [
      {
        name: "Raipur",
        coordinates: [81.6296, 21.2514],
        area: "220 km²",
        population: "1.01 Million",
        history: "Established in the 14th century by the Kalachuri king Ramachandra. It was later ruled by the Bhonsle Marathas and the British.",
        landmarks: ["Nandan Van Zoo", "Purkhouti Muktangan", "Swami Vivekananda Sarovar", "Mahant Ghasidas Memorial Museum"],
        geography: "Located in the center of a fertile plain called the Mahanadi River basin.",
        funFacts: [
          "Purkhouti Muktangan is an open-air museum showcasing the live tribal art and culture of Chhattisgarh.",
          "Swami Vivekananda spent two years of his teenage life in Raipur, and the lake is named in his memory."
        ]
      }
    ]
  },
  "Goa": {
    name: "Goa",
    capital: "Panaji",
    area: "3,702 km²",
    population: "1.58 Million",
    languages: ["Konkani", "English", "Marathi"],
    description: "India's smallest state by area, famous for its golden beaches, Portuguese heritage, spice plantations, and vibrant cultural festivals.",
    funFact: "Goa was ruled by the Portuguese for over 450 years—long after the rest of India gained independence from Britain!",
    cities: [
      {
        name: "Panaji",
        coordinates: [73.8278, 15.4909],
        area: "36 km²",
        population: "Approx. 114,000",
        history: "Developed from a small fishing village into a capital city by the Portuguese in 1843 after Old Goa was struck by epidemics.",
        landmarks: ["Our Lady of the Immaculate Conception Church", "Fontainhas (Latin Quarter)", "Miramar Beach", "Salim Ali Bird Sanctuary"],
        geography: "Located on the banks of the Mandovi River estuary, surrounded by hills, mangroves, and beaches.",
        funFacts: [
          "Fontainhas is Asia's oldest Latin Quarter, containing brightly colored houses with red-tiled roofs.",
          "Every house in Fontainhas must be painted every year after the monsoons by Portuguese law!"
        ]
      }
    ]
  },
  "Gujarat": {
    name: "Gujarat",
    capital: "Gandhinagar",
    area: "196,024 km²",
    population: "63.83 Million",
    languages: ["Gujarati", "Hindi"],
    description: "Located on India's western coast, Gujarat is famous for its maritime trade history, heritage textiles, salt deserts of Kutch, and as the birthplace of Mahatma Gandhi.",
    funFact: "Gujarat has the longest coastline of any Indian state, measuring about 1,600 kilometers!",
    cities: [
      {
        name: "Ahmedabad",
        coordinates: [72.5714, 23.0225],
        area: "505 km²",
        population: "5.63 Million",
        history: "Founded in 1411 by Sultan Ahmad Shah. It was a hub for textiles under the Mughals and British. It was the center of Mahatma Gandhi's early freedom struggle.",
        landmarks: ["Sabarmati Ashram", "Adalaj Stepwell", "Kankaria Lake", "Sidi Saiyyed Mosque"],
        geography: "Situated on the banks of the Sabarmati River in north-central Gujarat.",
        funFacts: [
          "It is India's first UNESCO World Heritage City, recognized for its historic architecture.",
          "The Sidi Saiyyed Mosque is world-famous for its exquisite stone latticework tree-of-life window."
        ]
      },
      {
        name: "Surat",
        coordinates: [72.8311, 21.1702],
        area: "462.14 km²",
        population: "4.46 Million",
        history: "Historically one of the most important ports in Western India, visited by Dutch, British, and Portuguese traders. The British East India Company established their first factory here.",
        landmarks: ["Surat Castle", "Dumas Beach", "Dutch Garden", "Gopi Talav"],
        geography: "Lies near the mouth of the Tapi River as it empties into the Arabian Sea.",
        funFacts: [
          "Known as the 'Diamond City of India'—over 90% of the world's diamonds are cut and polished here!",
          "Consistently ranked as one of the cleanest cities in India."
        ]
      }
    ]
  },
  "Haryana": {
    name: "Haryana",
    capital: "Chandigarh",
    area: "44,212 km²",
    population: "25.35 Million",
    languages: ["Haryanvi", "Hindi", "Punjabi"],
    description: "Surrounding Delhi on three sides, Haryana is an agricultural giant and the cradle of the ancient Indus Valley Civilization.",
    funFact: "Haryana is the land of milk and ghee, boasting some of the highest milk consumption rates in India!",
    cities: [
      {
        name: "Gurugram",
        coordinates: [77.0266, 28.4595],
        area: "232 km²",
        population: "876,000",
        history: "Originally named Gurgaon. In mythology, this village was gifted to Guru Dronacharya (the teacher of Pandavas and Kauravas) as a 'Guru-gram'. In the late 20th century, it transformed from a sleepy village into a global technology hub.",
        landmarks: ["Kingdom of Dreams", "Sultanpur National Park", "Cyber Hub", "Sheetla Mata Temple"],
        geography: "Part of the National Capital Region (NCR), characterized by flat plains bordering Rajasthan's semi-desert area.",
        funFacts: [
          "It is known as the 'Millennium City' and holds offices for over 250 Fortune 500 companies.",
          "It features some of the tallest residential and commercial skyscrapers in Northern India."
        ]
      }
    ]
  },
  "Himachal Pradesh": {
    name: "Himachal Pradesh",
    capital: "Shimla",
    area: "55,673 km²",
    population: "6.86 Million",
    languages: ["Hindi", "Pahari"],
    description: "A mountain state in the Western Himalayas, famous for its snow-capped peaks, apple orchards, hill stations, and adventure sports.",
    funFact: "Himachal Pradesh is nicknamed 'Fruit Bowl of the Country' due to its vast orchards of apples, plums, and peaches.",
    cities: [
      {
        name: "Shimla",
        coordinates: [77.1734, 31.1048],
        area: "25 km²",
        population: "169,000",
        history: "Named after Goddess Shyamala Devi. It was designated as the 'Summer Capital' of British India in 1864 due to its cool climate.",
        landmarks: ["The Ridge", "Jakhoo Temple (Monkey Temple)", "Kalka-Shimla Toy Train", "Mall Road"],
        geography: "Built on a mountain ridge in the middle of pine and deodar forests, average altitude is 2,206 meters.",
        funFacts: [
          "The Kalka-Shimla Railway is a UNESCO World Heritage Site with over 800 bridges and 103 tunnels!",
          "Jakhoo Hill features a massive 108-foot tall statue of Lord Hanuman, visible from most parts of Shimla."
        ]
      }
    ]
  },
  "Jharkhand": {
    name: "Jharkhand",
    capital: "Ranchi",
    area: "79,716 km²",
    population: "32.98 Million",
    languages: ["Hindi", "Santhali", "Khortha"],
    description: "Nicknamed 'Land of Forests' (Jhar-khand), this state is famous for its dense forests, waterfalls, tribal traditions, and vast mineral reserves.",
    funFact: "Jharkhand contains over 40% of India's total mineral wealth, including coal, iron ore, and copper!",
    cities: [
      {
        name: "Ranchi",
        coordinates: [85.3090, 23.3441],
        area: "650 km²",
        population: "1.07 Million",
        history: "Originally a tribal settlement of the Munda and Oraon communities. It was a center of the tribal freedom movement led by Birsa Munda in the late 19th century.",
        landmarks: ["Dassam Falls", "Jagannath Temple", "Ranchi Lake", "Pahari Mandir"],
        geography: "Located on the Chota Nagpur Plateau. Surrounded by multiple hills and cascading waterfalls, earning it the title 'City of Waterfalls'.",
        funFacts: [
          "The Tropic of Cancer passes directly through the outskirts of Ranchi (in Ormanjhi).",
          "It is the hometown of India's legendary cricket captain, Mahendra Singh Dhoni."
        ]
      }
    ]
  },
  "Karnataka": {
    name: "Karnataka",
    capital: "Bengaluru",
    area: "191,791 km²",
    population: "61.10 Million",
    languages: ["Kannada"],
    description: "A southern state that blends historic stone temples (like Hampi) with cutting-edge aerospace and software technology hubs.",
    funFact: "Karnataka produces around 70% of all coffee grown in India, dating back to 1670 when Baba Budan planted coffee seeds here.",
    cities: [
      {
        name: "Bengaluru",
        coordinates: [77.5946, 12.9716],
        area: "741 km²",
        population: "8.44 Million",
        history: "Founded in 1537 by Kempe Gowda, who built a mud fort here. It grew under Hyder Ali and Tipu Sultan. Became the IT capital of India starting in the 1980s.",
        landmarks: ["Lalbagh Botanical Garden", "Bangalore Palace", "Visvesvaraya Museum", "Vidhana Soudha"],
        geography: "Situated on the Deccan Plateau at an elevation of over 900 meters, which keeps its weather pleasant year-round.",
        funFacts: [
          "Nice to look at: widely celebrated as the 'Silicon Valley of India' and the 'Garden City'.",
          "Lalbagh contains India's largest collection of tropical plants and a glass house modeled on London's Crystal Palace."
        ]
      },
      {
        name: "Mysore",
        coordinates: [76.6394, 12.2958],
        area: "128.42 km²",
        population: "920,000",
        history: "Capital of the Kingdom of Mysore ruled by the Wadiyar Dynasty and temporarily by Hyder Ali/Tipu Sultan. Famous for patronage of arts, music, and yoga.",
        landmarks: ["Mysore Palace", "Chamundi Hill", "Brindavan Gardens", "Mysore Zoo"],
        geography: "Located in the foothills of the Chamundi Hills, surrounded by scenic lakes.",
        funFacts: [
          "The Mysore Palace is one of India's most visited landmarks; during Dasara, it is lit by nearly 100,000 light bulbs!",
          "Famous for Mysore Pak (a sweet made of chickpea flour, ghee, and sugar) and Mysore Silk."
        ]
      }
    ]
  },
  "Kerala": {
    name: "Kerala",
    capital: "Thiruvananthapuram",
    area: "38,863 km²",
    population: "33.40 Million",
    languages: ["Malayalam"],
    description: "Known as 'God's Own Country', Kerala is famous for its palm-lined beaches, backwaters, network of canals, wildlife, spices, and high literacy rates.",
    funFact: "Kerala has the highest literacy rate (over 94%) and the highest life expectancy of any state in India!",
    cities: [
      {
        name: "Thiruvananthapuram",
        coordinates: [76.9366, 8.5241],
        area: "214.86 km²",
        population: "957,000",
        history: "Historically known as Trivandrum. It was the capital of the Kingdom of Travancore. Maharaja Marthanda Varma dedicated the kingdom to Lord Padmanabha in 1750.",
        landmarks: ["Sree Padmanabhaswamy Temple", "Kovalam Beach", "Napier Museum", "Space Museum (VSSC)"],
        geography: "Built on seven low hills near the southwestern coast of India, bordering the Arabian Sea.",
        funFacts: [
          "The Padmanabhaswamy Temple is considered the wealthiest place of worship in the world due to its ancient hidden vaults.",
          "It is where the first sounding rocket was launched in India in 1963, launching India's space program."
        ]
      },
      {
        name: "Kochi",
        coordinates: [76.2673, 9.9312],
        area: "94.88 km²",
        population: "602,000",
        history: "Historically known as Cochin. Known as the 'Queen of the Arabian Sea', it was a major spice trading center since the 14th century, trading with Arabs, Chinese, Portuguese, Dutch, and British.",
        landmarks: ["Fort Kochi Chinese Fishing Nets", "Mattancherry Palace (Dutch Palace)", "St. Francis Church", "Marine Drive"],
        geography: "A collection of islands and peninsulas nestled between the Arabian Sea and the Vembanad Lake backwaters.",
        funFacts: [
          "St. Francis Church is the oldest European church built in India, where explorer Vasco da Gama was originally buried in 1524.",
          "Kochi has the world's first fully solar-powered international airport!"
        ]
      }
    ]
  },
  "Madhya Pradesh": {
    name: "Madhya Pradesh",
    capital: "Bhopal",
    area: "308,252 km²",
    population: "72.63 Million",
    languages: ["Hindi"],
    description: "The 'Heart of India' is famous for its wildlife reserves, ancient rock shelters (Bhimbetka), Khajuraho temples, and medieval forts.",
    funFact: "Madhya Pradesh has the largest forest cover of any state in India, accounting for over 25% of its total area!",
    cities: [
      {
        name: "Bhopal",
        coordinates: [77.4126, 23.2599],
        area: "285.88 km²",
        population: "1.80 Million",
        history: "Founded by King Bhoja in the 11th century. Later ruled by the legendary Begums of Bhopal (female Muslim rulers) who built its grand mosques and infrastructure in the 19th and 20th centuries.",
        landmarks: ["Upper Lake (Bhojtal)", "Taj-ul-Masajid", "Sanchi Stupa (nearby)", "Bhimbetka Caves (nearby)"],
        geography: "Built on a hilly terrain with multiple natural and artificial lakes, earning it the title 'City of Lakes'.",
        funFacts: [
          "Bhojtal is one of the oldest and largest artificial lakes in India, built in the 11th century.",
          "Taj-ul-Masajid is one of the largest mosques in Asia, with a capacity of over 100,000 worshippers."
        ]
      },
      {
        name: "Indore",
        coordinates: [75.8577, 22.7196],
        area: "530 km²",
        population: "2.17 Million",
        history: "Rose to prominence in the 18th century under Rani Ahilyabai Holkar of the Maratha Empire, who was a great builder of temples across India.",
        landmarks: ["Rajwada Palace", "Lal Bagh Palace", "Kanch Mandir (Glass Temple)", "Chappan Dukan (Food Street)"],
        geography: "Located on the southern edge of the Malwa plateau, with two small rivers (Saraswati and Khan) flowing through it.",
        funFacts: [
          "It has been ranked as the cleanest city in India for 7 consecutive years under the Swachh Survekshan!",
          "It is the only city in India to host both an IIT (Indian Institute of Technology) and an IIM (Indian Institute of Management)."
        ]
      }
    ]
  },
  "Maharashtra": {
    name: "Maharashtra",
    capital: "Mumbai",
    area: "307,713 km²",
    population: "112.37 Million",
    languages: ["Marathi"],
    description: "India's economic powerhouse, blending massive financial centers with historical cave temples (Ajanta/Ellora) and the fortress heritage of Shivaji Maharaj.",
    funFact: "Maharashtra is home to the Lonar Lake, a unique saline soda lake created by a meteorite impact 52,000 years ago!",
    cities: [
      {
        name: "Mumbai",
        coordinates: [72.8777, 19.0760],
        area: "603.4 km²",
        population: "12.44 Million",
        history: "Originally a group of seven islands inhabited by Koli fishermen. It was ceded to the Portuguese and then the British as a marriage dowry. Connected via reclamation to form Bombay, the center of India's trade and cotton boom.",
        landmarks: ["Gateway of India", "Chhatrapati Shivaji Terminus", "Marine Drive", "Sanjay Gandhi National Park"],
        geography: "A peninsula on the western coast of India, flanked by the Arabian Sea and a natural deepwater harbor.",
        funFacts: [
          "Known as the 'City of Dreams' and is the home of Bollywood, the world's largest film industry.",
          "Chhatrapati Shivaji Terminus is a UNESCO World Heritage Site showing breathtaking Victorian Gothic architecture."
        ]
      },
      {
        name: "Pune",
        coordinates: [73.8567, 18.5204],
        area: "331.26 km²",
        population: "3.12 Million",
        history: "Capital of the Maratha Empire under the Peshwas in the 18th century. It was the center of social reform movements led by Jyotirao Phule and Savitribai Phule.",
        landmarks: ["Shaniwar Wada", "Aga Khan Palace", "Sinhagad Fort", "Pataleshwar Cave Temple"],
        geography: "Located at the confluence of the Mula and Mutha rivers, on the leeward side of the Sahyadri mountains (Western Ghats).",
        funFacts: [
          "Known as the 'Oxford of the East' due to the huge presence of universities and international students.",
          "The Aga Khan Palace served as a prison for Mahatma Gandhi and Kasturba Gandhi during the Quit India Movement."
        ]
      }
    ]
  },
  "Manipur": {
    name: "Manipur",
    capital: "Imphal",
    area: "22,327 km²",
    population: "2.86 Million",
    languages: ["Meiteilon (Manipuri)"],
    description: "A border state in Northeast India, famous for its classical dance form, floating lake, and rich sports culture.",
    funFact: "Manipur is the birth country of modern polo, which was adapted by the British from the local Manipuri game 'Sagol Kangjei'.",
    cities: [
      {
        name: "Imphal",
        coordinates: [93.9368, 24.8170],
        area: "140 km²",
        population: "268,000",
        history: "Seat of the ancient Kingdom of Manipur. It was the site of the Battle of Imphal in 1944 during WWII, where Allied forces successfully pushed back the Japanese Army.",
        landmarks: ["Kangla Fort", "Loktak Lake (nearby)", "Keibul Lamjao National Park (nearby)", "Ima Keithel (Mothers' Market)"],
        geography: "Situated in an oval-shaped valley surrounded by hills at an elevation of 790 meters.",
        funFacts: [
          "Ima Keithel is a 500-year-old market run entirely by thousands of married women, making it the largest women-only market in Asia.",
          "Loktak Lake is the world's only floating lake due to floating vegetation rings called 'phumdis'."
        ]
      }
    ]
  },
  "Meghalaya": {
    name: "Meghalaya",
    capital: "Shillong",
    area: "22,429 km²",
    population: "2.96 Million",
    languages: ["Khasi", "Garo", "English"],
    description: "The 'Abode of Clouds' is a mountainous state famous for hosting the wettest places on earth, living root bridges, and caves.",
    funFact: "Meghalaya's Khasi and Jaintia tribes follow a matrilineal system where children take their mother's family name!",
    cities: [
      {
        name: "Shillong",
        coordinates: [91.8833, 25.5788],
        area: "64.36 km²",
        population: "143,000",
        history: "A small village that grew into a civil station for the British administration in the late 19th century. Nicknamed 'Scotland of the East' by British officers who were reminded of Scottish highlands.",
        landmarks: ["Shillong Peak", "Elephant Falls", "Umiam Lake", "Don Bosco Museum"],
        geography: "Located on a plateau surrounded by pine forests, lying between the Khasi and Jaintia Hills.",
        funFacts: [
          "Mawsynram, a village near Shillong, holds the Guinness World Record for being the wettest place on Earth with 11,872 mm of rain annually!",
          "Features a thriving local indie rock and choral music scene, earning it the title 'Rock Capital of India'."
        ]
      }
    ]
  },
  "Mizoram": {
    name: "Mizoram",
    capital: "Aizawl",
    area: "21,081 km²",
    population: "1.09 Million",
    languages: ["Mizo", "English"],
    description: "A land of rolling hills, bamboo forests, and vibrant cultural dances. It has a high rate of literacy and clean environment.",
    funFact: "Mizoram has one of the highest forest covers in India, with around 85% of its geographical area covered in forests!",
    cities: [
      {
        name: "Aizawl",
        coordinates: [92.7176, 23.7271],
        area: "45.7 km²",
        population: "Approx. 293,000",
        history: "Originally established as a military outpost by the British in 1890 during the Mizo hills expeditions.",
        landmarks: ["Solomon's Temple", "Mizoram State Museum", "Reiek Tlang (Peak)", "Durtlang Hills"],
        geography: "Perched on a steep ridge at an altitude of 1,132 meters, overlooking the Tlawng river valley.",
        funFacts: [
          "Solomon's Temple is a massive white-marble church built entirely by members of a local religious group.",
          "Traffic in Aizawl is world-famous for its extreme discipline—drivers respect lane discipline and never honk!"
        ]
      }
    ]
  },
  "Nagaland": {
    name: "Nagaland",
    capital: "Kohima",
    area: "16,579 km²",
    population: "1.97 Million",
    languages: ["English", "Nagamese"],
    description: "A vibrant state in the northeast, famous for its colorful tribal festivals (Hornbill Festival), handloom crafts, and mountainous landscapes.",
    funFact: "Nagaland is known as the 'Land of Festivals', where 16 major tribes host their distinct festivals celebrating agriculture and harvest.",
    cities: [
      {
        name: "Kohima",
        coordinates: [94.1086, 25.6751],
        area: "20 km²",
        population: "99,000",
        history: "Originally named Kewhira, after a wild flower. It was the site of the Battle of Kohima in 1944, often called the 'Stalingrad of the East', where Allied forces halted the Japanese advance into India during WWII.",
        landmarks: ["Kohima War Cemetery", "Kisama Heritage Village", "Dzukou Valley (nearby)", "Japfu Peak"],
        geography: "Located in the southern part of Nagaland, built on a series of ridges in the high hills.",
        funFacts: [
          "The Kohima War Cemetery holds a famous epitaph: 'When you go home, tell them of us and say, For your tomorrow, we gave our today'.",
          "Kisama Heritage Village hosts the world-famous Hornbill Festival every year in December."
        ]
      }
    ]
  },
  "Odisha": {
    name: "Odisha",
    capital: "Bhubaneswar",
    area: "155,707 km²",
    population: "41.97 Million",
    languages: ["Odia"],
    description: "Famous for its ancient stone temples, classical Odissi dance, silver filigree work, and the vast Chilika lake.",
    funFact: "Odisha's Konark Sun Temple is designed as a colossal stone chariot with 24 wheels, which act as accurate sundials to tell the time!",
    cities: [
      {
        name: "Bhubaneswar",
        coordinates: [85.8245, 20.2961],
        area: "161 km²",
        population: "837,000",
        history: "Anciently a major center of the Kalinga Kingdom. It is where Emperor Ashoka renounced violence and converted to Buddhism after the bloody Kalinga War in 261 BCE.",
        landmarks: ["Lingaraj Temple", "Udayagiri & Khandagiri Caves", "Dhauli Shanti Stupa", "Nandankanan Zoological Park"],
        geography: "Situated on the coastal plains of eastern India, along the Daya River.",
        funFacts: [
          "Known as the 'Temple City of India'—it once had over 7,000 historic temples!",
          "It is one of India's first modern planned cities, designed by German architect Otto Königsberger in 1946."
        ]
      }
    ]
  },
  "Punjab": {
    name: "Punjab",
    capital: "Chandigarh",
    area: "50,362 km²",
    population: "27.74 Million",
    languages: ["Punjabi"],
    description: "The 'Land of Five Rivers' is the cultural heartland of agricultural India, famous for Bhangra dance, warm hospitality, and historic gurudwaras.",
    funFact: "Punjab is the birthplace of Sikhism, founded by Guru Nanak Dev Ji in the late 15th century.",
    cities: [
      {
        name: "Amritsar",
        coordinates: [74.8723, 31.6340],
        area: "170 km²",
        population: "1.13 Million",
        history: "Founded in 1577 by Guru Ram Das, the fourth Sikh Guru, around a sacred pool. It was the site of the Jallianwala Bagh massacre in 1919 and Partition struggles in 1947.",
        landmarks: ["Golden Temple (Harmandir Sahib)", "Jallianwala Bagh", "Wagah Border (nearby)", "Partition Museum"],
        geography: "Located in northwestern Punjab near the international border with Pakistan.",
        funFacts: [
          "The Golden Temple features a community kitchen (Langar) that serves free hot meals to over 100,000 people daily, regardless of religion or status.",
          "The temple is plated with over 750 kilograms of pure gold!"
        ]
      }
    ]
  },
  "Rajasthan": {
    name: "Rajasthan",
    capital: "Jaipur",
    area: "342,239 km²",
    population: "68.55 Million",
    languages: ["Rajasthani", "Hindi"],
    description: "India's largest state by area, famous for the Thar Desert, majestic hilltop forts, colorful palaces, folk music, and camel fairs.",
    funFact: "Rajasthan is home to India's only desert river, the Luni River, which flows into the salt marshes of Kutch without reaching the sea.",
    cities: [
      {
        name: "Jaipur",
        coordinates: [75.7873, 26.9124],
        area: "485 km²",
        population: "3.07 Million",
        history: "Founded in 1727 by Maharaja Sawai Jai Singh II, a keen astronomer. Designed according to Vastu Shastra principles. Painted pink in 1876 to welcome Prince Albert.",
        landmarks: ["Hawa Mahal", "Amer Fort", "Jantar Mantar", "City Palace"],
        geography: "Surrounded by the Aravalli hills on three sides, bordering the semi-arid plains.",
        funFacts: [
          "Known as the 'Pink City' due to its pink-colored historic buildings.",
          "Jantar Mantar is a UNESCO World Heritage Site containing the world's largest stone sundial, which tells time accurate to two seconds!"
        ]
      },
      {
        name: "Udaipur",
        coordinates: [73.6824, 24.5854],
        area: "64 km²",
        population: "474,000",
        history: "Founded in 1553 by Maharana Udai Singh II as the new capital of Mewar kingdom, after Chittorgarh Fort was besieged by Mughal Emperor Akbar.",
        landmarks: ["Lake Palace (Jag Niwas)", "City Palace Complex", "Lake Pichola", "Sajjangarh Monsoon Palace"],
        geography: "Nestled in the valleys of the Aravalli Range, surrounded by several artificial freshwater lakes.",
        funFacts: [
          "Often called the 'Venice of the East' and the 'City of Lakes'.",
          "The Lake Palace is a stunning white-marble palace built on an island in Lake Pichola, appearing to float on water."
        ]
      }
    ]
  },
  "Sikkim": {
    name: "Sikkim",
    capital: "Gangtok",
    area: "7,096 km²",
    population: "610,577",
    languages: ["Nepali", "Sikkimese", "English", "Lepcha"],
    description: "A tiny Himalayan state nestled below Mount Kanchenjunga, the third-highest mountain peak in the world. Famous for glaciers, alpine meadows, and biodiversity.",
    funFact: "Sikkim is the first state in the world to become 100% fully organic, banning all chemical fertilizers and pesticides!",
    cities: [
      {
        name: "Gangtok",
        coordinates: [88.6138, 27.3314],
        area: "19.2 km²",
        population: "100,000",
        history: "A major Buddhist pilgrimage site that became the capital of the Chogyal Kingdom of Sikkim in the late 19th century.",
        landmarks: ["Rumtek Monastery", "Nathula Pass (nearby)", "Tsomgo Lake (nearby)", "Namgyal Institute of Tibetology"],
        geography: "Built on a ridge side at an altitude of 1,650 meters, offering clear views of the Kanchenjunga range.",
        funFacts: [
          "Nathula Pass, located near Gangtok, is a historical branch of the ancient Silk Road connecting India and Tibet.",
          "You can take a cable car ride directly over the city of Gangtok to view the valley below."
        ]
      }
    ]
  },
  "Tamil Nadu": {
    name: "Tamil Nadu",
    capital: "Chennai",
    area: "130,058 km²",
    population: "72.14 Million",
    languages: ["Tamil"],
    description: "A cradle of ancient Dravidian culture, famous for its towering stone temples (Gopurams), classical Bharatanatyam dance, Carnatic music, and filter coffee.",
    funFact: "Tamil is recognized as one of the longest-surviving classical languages in the world, with literature dating back over 2,000 years!",
    cities: [
      {
        name: "Chennai",
        coordinates: [80.2707, 13.0827],
        area: "426 km²",
        population: "7.08 Million",
        history: "Historically known as Madras. Established around Fort St. George built by the British East India Company in 1639. It was part of the Chola and Pallava empires.",
        landmarks: ["Marina Beach", "Kapaleeshwarar Temple", "Fort St. George", "Government Museum"],
        geography: "Located on the flat coastal plains of the Bay of Bengal, featuring a tropical wet-and-dry climate.",
        funFacts: [
          "Marina Beach is the longest natural urban beach in India, stretching over 13 kilometers!",
          "Known as the 'Detroit of India' because it produces over 30% of India's automobiles."
        ]
      },
      {
        name: "Madurai",
        coordinates: [78.1198, 9.9252],
        area: "148 km²",
        population: "1.02 Million",
        history: "One of the oldest continuously inhabited cities in the world. It was the capital of the ancient Pandyan Kingdom and the seat of Tamil Sangams (literary academies).",
        landmarks: ["Meenakshi Amman Temple", "Thirumalai Nayakkar Mahal", "Gandhi Memorial Museum"],
        geography: "Situated on the banks of the Vaigai River in southern Tamil Nadu.",
        funFacts: [
          "The Meenakshi Temple features 14 majestic gateway towers (Gopurams), the tallest being 170 feet high!",
          "Called 'Thoonga Nagaram' (the city that never sleeps) due to its thriving active nightlife and street markets."
        ]
      }
    ]
  },
  "Telangana": {
    name: "Telangana",
    capital: "Hyderabad",
    area: "112,077 km²",
    population: "35.19 Million",
    languages: ["Telugu", "Urdu"],
    description: "Formed in 2014, Telangana is rich in history and contains major technology corporations as well as traditional textile crafts like Pochampally.",
    funFact: "Telangana is home to the Ramappa Temple, a UNESCO World Heritage Site constructed using floating bricks that are lighter than water!",
    cities: [
      {
        name: "Hyderabad",
        coordinates: [78.4867, 17.3850],
        area: "650 km²",
        population: "6.81 Million",
        history: "Founded in 1591 by Muhammad Quli Qutb Shah. Ruled by the wealthy Nizams of Hyderabad. It was world-famous as a diamond trading center, handling diamonds like the Koh-i-Noor.",
        landmarks: ["Charminar", "Golconda Fort", "Salar Jung Museum", "Hussain Sagar Lake"],
        geography: "Located on the Deccan Plateau, along the banks of the Musi River.",
        funFacts: [
          "Known as the 'City of Pearls' and is globally famous for its authentic Hyderabadi Biryani.",
          "The Salar Jung Museum contains the world's largest one-man collection of antiques, including the famous double-statue of Mephistopheles and Margaretta."
        ]
      }
    ]
  },
  "Tripura": {
    name: "Tripura",
    capital: "Agartala",
    area: "10,491 km²",
    population: "3.67 Million",
    languages: ["Kokborok", "Bengali"],
    description: "A small northeast state bordered on three sides by Bangladesh, famous for its royal palaces, archaeological rock carvings, and bamboo crafts.",
    funFact: "Tripura was an independent kingdom ruled by the Manikya Dynasty for centuries before merging with India in 1949.",
    cities: [
      {
        name: "Agartala",
        coordinates: [91.2868, 23.8315],
        area: "76.5.7 km²",
        population: "Approx. 400,000",
        history: "Established as the capital in 1849 by Maharaja Krishna Kishore Manikya, who shifted the royal seat here.",
        landmarks: ["Ujjayanta Palace", "Neermahal (Water Palace)", "Unakoti (nearby rock cuts)", "Tripura Sundari Temple"],
        geography: "Located on the banks of the Haroa River, close to the international border with Bangladesh.",
        funFacts: [
          "Ujjayanta Palace is a massive white royal palace built in 1901, now serving as a heritage museum.",
          "Neermahal is one of only two water palaces in India, built in the middle of Rudrasagar Lake."
        ]
      }
    ]
  },
  "Uttar Pradesh": {
    name: "Uttar Pradesh",
    capital: "Lucknow",
    area: "243,286 km²",
    population: "199.81 Million",
    languages: ["Hindi", "Urdu"],
    description: "India's most populous state, situated in the fertile Gangetic plains. It is home to India's most iconic monument, the Taj Mahal.",
    funFact: "If Uttar Pradesh were an independent country, it would be the fifth most populous country in the world!",
    cities: [
      {
        name: "Agra",
        coordinates: [78.0081, 27.1767],
        area: "188 km²",
        population: "1.58 Million",
        history: "Capital of the Mughal Empire under Akbar, Jahangir, and Shah Jahan. It is a major global tourist destination due to its rich collection of Islamic architecture.",
        landmarks: ["Taj Mahal", "Agra Fort", "Fatehpur Sikri"],
        geography: "Situated on the banks of the Yamuna River in western Uttar Pradesh.",
        funFacts: [
          "The Taj Mahal is one of the Seven Wonders of the Ancient and Modern World, built by Shah Jahan in memory of Mumtaz Mahal.",
          "Fatehpur Sikri, built by Akbar, features Buland Darwaza—the highest gateway in the world!"
        ]
      },
      {
        name: "Varanasi",
        coordinates: [82.9739, 25.3176],
        area: "82 km²",
        population: "1.20 Million",
        history: "Also known as Kashi or Benares. It is one of the oldest continuously inhabited cities in the world. It is the spiritual capital of Hinduism, where Gautama Buddha delivered his first sermon in nearby Sarnath.",
        landmarks: ["Kashi Vishwanath Temple", "Dashashwamedh Ghat", "Sarnath", "Banaras Hindu University"],
        geography: "Located on the crescent-shaped banks of the river Ganga in eastern Uttar Pradesh.",
        funFacts: [
          "Famous for Banarasi Silk sarees, which feature intricate gold and silver brocade work.",
          "The Ganga Aarti performed at Dashashwamedh Ghat every evening is a famous spiritual ceremony visited by thousands."
        ]
      },
      {
        name: "Lucknow",
        coordinates: [80.9462, 26.8467],
        area: "349 km²",
        population: "2.81 Million",
        history: "Capital of the Nawabs of Awadh in the 18th and 19th centuries, who patronized Urdu poetry, Kathak dance, and fine dining.",
        landmarks: ["Bara Imambara", "Chhota Imambara", "Rumi Darwaza", "British Residency"],
        geography: "Lies on the banks of the Gomti River in central Uttar Pradesh.",
        funFacts: [
          "Bara Imambara features the famous Bhool Bhulaiya—a labyrinth of hundreds of identical corridor paths where you can easily get lost without a guide!",
          "Famous for 'Chikan' embroidery, a traditional and delicate hand-embroidery style."
        ]
      }
    ]
  },
  "Uttarakhand": {
    name: "Uttarakhand",
    capital: "Dehradun",
    area: "53,483 km²",
    population: "10.08 Million",
    languages: ["Hindi", "Garhwali", "Kumaoni"],
    description: "Nicknamed 'Devbhumi' (Land of the Gods), Uttarakhand is situated in the Himalayas and contains the sources of India's holy rivers, the Ganga and Yamuna.",
    funFact: "Uttarakhand is home to the Valley of Flowers National Park, a UNESCO World Heritage site known for its meadows of alpine flowers.",
    cities: [
      {
        name: "Dehradun",
        coordinates: [78.0322, 30.3165],
        area: "196.48 km²",
        population: "578,000",
        history: "According to legend, Guru Ram Rai (eldest son of Seventh Sikh Guru Har Rai) established a camp ('Dehra') in this valley ('Dun') in 1676.",
        landmarks: ["Robber's Cave (Guchhupani)", "Mindrolling Monastery", "Forest Research Institute", "Tapkeshwar Temple"],
        geography: "Nestled in the Doon Valley between the Himalayas and the Shivalik Hills, with Ganga and Yamuna rivers on its east and west.",
        funFacts: [
          "The Forest Research Institute has a massive Greco-Roman building, which is larger than Buckingham Palace!",
          "It is the gateway to famous hill stations like Mussoorie and pilgrimage towns like Rishikesh."
        ]
      }
    ]
  },
  "West Bengal": {
    name: "West Bengal",
    capital: "Kolkata",
    area: "88,752 km²",
    population: "91.27 Million",
    languages: ["Bengali", "English"],
    description: "Located between the Himalayas and the Bay of Bengal. Famous for its intellectual heritage, Nobel laureates, Sweet delicacies, and Sundarbans tiger reserve.",
    funFact: "West Bengal is home to the Sundarbans, the largest mangrove forest in the world and the habitat of the Royal Bengal Tiger.",
    cities: [
      {
        name: "Kolkata",
        coordinates: [88.3639, 22.5726],
        area: "206.08 km²",
        population: "4.50 Million",
        history: "Developed by the British East India Company from three villages. It served as the capital of British India until 1911. Center of the 19th-century Bengal Renaissance.",
        landmarks: ["Victoria Memorial", "Howrah Bridge", "Indian Museum", "Dakshineswar Kali Temple"],
        geography: "Located on the east bank of the Hooghly River (a branch of the Ganga), close to the Sundarbans delta.",
        funFacts: [
          "Known as the 'City of Joy' and the 'Cultural Capital of India'.",
          "Kolkata is the only city in India to operate a historic electric tram network, running since 1902!"
        ]
      },
      {
        name: "Darjeeling",
        coordinates: [88.2627, 27.0410],
        area: "10.57 km²",
        population: "Approx. 132,000",
        history: "Developed as a sanatorium and hill station by the British in the mid-19th century. Tea seeds smuggled from China were planted here, creating the world's most aromatic tea.",
        landmarks: ["Tiger Hill", "Darjeeling Himalayan Railway", "Batasia Loop", "Padmaja Naidu Himalayan Zoo"],
        geography: "Located in the Lesser Himalayas at an average elevation of 2,045 meters.",
        funFacts: [
          "The Darjeeling Himalayan Railway (Toy Train) is a UNESCO World Heritage Site powered by vintage steam locomotives.",
          "Tiger Hill is famous for its sunrise views of Mount Everest and Mount Kanchenjunga together."
        ]
      }
    ]
  },
  "Jammu & Kashmir": {
    name: "Jammu & Kashmir",
    capital: "Srinagar (Summer) / Jammu (Winter)",
    area: "42,241 km²",
    population: "12.26 Million",
    languages: ["Kashmiri", "Dogri", "Urdu", "Hindi"],
    description: "Known as 'Paradise on Earth', it is famous for its snow-covered mountains, lakes, houseboats, gardens, saffron fields, and Kashmiri handicrafts.",
    funFact: "Jammu & Kashmir is the largest producer of saffron in India and produces some of the highest-grade saffron in the world!",
    cities: [
      {
        name: "Srinagar",
        coordinates: [74.7973, 34.0837],
        area: "294 km²",
        population: "1.18 Million",
        history: "Dating back to the 3rd century BCE, founded by Emperor Ashoka. Later ruled by the Kushans, Mughals, Afghans, Sikhs, and Dogras.",
        landmarks: ["Dal Lake", "Shalimar Bagh Mughal Garden", "Nishat Bagh", "Hazratbal Shrine"],
        geography: "Located in the heart of the Kashmir Valley, along the banks of the Jhelum River, surrounded by snow-capped mountains.",
        funFacts: [
          "Famous for Dal Lake houseboats and Shikaras (traditional wooden boats used for transport and floating markets).",
          "Features Asia's largest Tulip Garden (Indira Gandhi Memorial Tulip Garden) on the foothills of the Zabarwan range."
        ]
      },
      {
        name: "Jammu",
        coordinates: [74.8570, 32.7266],
        area: "112 km²",
        population: "502,000",
        history: "Founded by Raja Jambu Lochan in the 14th century BCE, who named it Jambu after seeing a goat and a lion drinking water from the same spot on the Tawi River.",
        landmarks: ["Bahu Fort", "Raghunath Temple", "Amar Mahal Palace Museum", "Vaishno Devi Temple (nearby)"],
        geography: "Situated on the banks of the Tawi River, bordering the plains of Punjab to the south and Shivalik range to the north.",
        funFacts: [
          "Known as the 'City of Temples' due to the hundreds of historical temples and shrines located here.",
          "Bahu Fort contains a temple dedicated to Goddess Kali, surrounded by a terrace garden called 'Bagh-e-Bahu'."
        ]
      }
    ]
  },
  "Ladakh": {
    name: "Ladakh",
    capital: "Leh",
    area: "59,146 km²",
    population: "274,000",
    languages: ["Ladakhi", "Tibetan", "Balti", "English"],
    description: "A high-altitude cold desert in the Trans-Himalayas, famous for its dramatic barren landscapes, turquoise lakes, Buddhist monasteries (Gompas), and yak culture.",
    funFact: "Ladakh is home to the Magnetic Hill, where gravity appears to be defied, and vehicles seem to roll uphill when left in neutral!",
    cities: [
      {
        name: "Leh",
        coordinates: [77.5782, 34.1526],
        area: "9.15 km²",
        population: "Approx. 30,800",
        history: "Historically an important stopover on trade routes between India, Tibet, and China. Built around the 17th-century Leh Palace, the residence of the Namgyal Dynasty.",
        landmarks: ["Leh Palace", "Shanti Stupa", "Thiksey Monastery (nearby)", "Pangong Tso Lake (nearby)"],
        geography: "Located at a high altitude of 3,500 meters in the Indus River Valley.",
        funFacts: [
          "The Leh Palace was modeled after the famous Potala Palace in Lhasa, Tibet.",
          "Shanti Stupa was built by Japanese Buddhists to promote world peace and was inaugurated by the 14th Dalai Lama."
        ]
      }
    ]
  },
  "Delhi": {
    name: "Delhi",
    capital: "New Delhi",
    area: "1,484 km²",
    population: "16.78 Million",
    languages: ["Hindi", "Punjabi", "Urdu", "English"],
    description: "India's capital territory and historic hub, continuously inhabited for over 2,500 years. It contains UNESCO heritage monuments alongside massive modern government buildings.",
    funFact: "Delhi's Khari Baoli is Asia's largest wholesale spice market, operating since the 17th century!",
    cities: [
      {
        name: "New Delhi",
        coordinates: [77.2090, 28.6139],
        area: "42.7 km²",
        population: "Approx. 257,000",
        history: "Designed by British architects Sir Edwin Lutyens and Sir Herbert Baker in the early 20th century as the capital of the British Indian Empire, replacing Calcutta.",
        landmarks: ["India Gate", "Rashtrapati Bhavan", "Qutub Minar", "Humayun's Tomb", "Lotus Temple"],
        geography: "Located in the Indo-Gangetic plains, flanked by the Yamuna River to the east and the Aravalli hills ridge to the west.",
        funFacts: [
          "Rashtrapati Bhavan is the second-largest presidential residence in the world, containing 340 rooms.",
          "The Lotus Temple is shaped like a blooming white lotus flower and is open to people of all religions."
        ]
      }
    ]
  }
};

const otherUTs = [
  "Chandigarh", "Lakshadweep", "Puducherry", "Andaman & Nicobar", 
  "Dadra and Nagar Haveli and Daman and Diu"
];

const utCapitals: Record<string, string> = {
  "Chandigarh": "Chandigarh",
  "Lakshadweep": "Kavaratti",
  "Puducherry": "Puducherry",
  "Andaman & Nicobar": "Sri Vijaya Puram",
  "Dadra and Nagar Haveli and Daman and Diu": "Daman"
};

const utAreas: Record<string, string> = {
  "Chandigarh": "114 km²",
  "Lakshadweep": "32.62 km²",
  "Puducherry": "479 km²",
  "Andaman & Nicobar": "8,249 km²",
  "Dadra and Nagar Haveli and Daman and Diu": "603 km²"
};

const utPopulations: Record<string, string> = {
  "Chandigarh": "1.06 Million",
  "Lakshadweep": "64,000",
  "Puducherry": "1.24 Million",
  "Andaman & Nicobar": "380,000",
  "Dadra and Nagar Haveli and Daman and Diu": "586,000"
};

const utCoords: Record<string, [number, number]> = {
  "Chandigarh": [76.7794, 30.7333],
  "Lakshadweep": [72.6417, 10.5667],
  "Puducherry": [79.8083, 11.9416],
  "Andaman & Nicobar": [92.7265, 11.6234],
  "Dadra and Nagar Haveli and Daman and Diu": [72.8258, 20.3974]
};

const utDescriptions: Record<string, string> = {
  "Chandigarh": "A union territory that serves as the joint capital of Punjab and Haryana. It is a prestigious modern city designed by Swiss-French architect Le Corbusier.",
  "Lakshadweep": "India's smallest union territory, consisting of an archipelago of 36 beautiful coral islands in the Laccadive Sea, famous for white-sand beaches and marine life.",
  "Puducherry": "Historically known as Pondicherry, this coastal territory was a French colonial settlement until 1954, characterized by French-style villas and spiritual ashrams.",
  "Andaman & Nicobar": "A group of scenic tropical islands in the Bay of Bengal, known for biodiversity, coral reefs, and the historical Cellular Jail monument.",
  "Dadra and Nagar Haveli and Daman and Diu": "A combined union territory on India's western coast, featuring Portuguese fort ruins, scenic beaches, and industrial centers."
};

otherUTs.forEach(ut => {
  if (!educationalData[ut]) {
    educationalData[ut] = {
      name: ut,
      capital: utCapitals[ut] || "N/A",
      area: utAreas[ut] || "N/A",
      population: utPopulations[ut] || "N/A",
      languages: ["English", "Hindi"],
      description: utDescriptions[ut] || `The Union Territory of ${ut}.`,
      cities: [
        {
          name: utCapitals[ut] || ut,
          coordinates: utCoords[ut] || [78.96, 22.59],
          // Territory-wide figures are not city figures. Leave unverified fields empty.
          area: "",
          population: "",
          history: "",
          landmarks: [],
          geography: "",
          funFacts: [`It is the administrative capital of the union territory of ${ut}.`]
        }
      ],
      funFact: `Discover the unique history and geography of ${ut}.`
    };
  }
});
