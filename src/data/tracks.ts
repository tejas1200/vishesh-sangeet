import { Track } from '../types';

// Importing our generated cover artwork asset
import namokarCover from '../assets/images/namokar_cover_1786536333226.jpg';

export const JAIN_TRACKS: Track[] = [
  {
    id: 'namokar-mantra',
    title: 'Namokar Mantra',
    titleDevanagari: 'णमोकार मंत्र',
    subtitle: 'Sacred Jain Chants',
    metadata: 'Traditional Jain Chant',
    duration: 210, // 3:30
    coverUrl: namokarCover,
    composer: 'Eternal Jain Tradition',
    raga: 'Malkauns / Peaceful Drone',
    description: 'The supreme sacred chant of Jainism bowing to the five supreme souls (Pancha Parameshti). Brings infinite inner peace and spiritual strength.',
    lyricsDevanagari: [
      'णमो अरिहंताणं - Bowing to the Arihantas (Pure Enlightened Souls)',
      'णमो सिद्धाणं - Bowing to the Siddhas (Liberated Souls)',
      'णमो आयरियाणं - Bowing to the Acharyas (Spiritual Masters)',
      'णमो उवज्झायाणं - Bowing to the Upadhyayas (Spiritual Teachers)',
      'णमो लोए सव्व साहूणं - Bowing to All Ascetics in the Universe',
      'एसो पंच णमोक्कारो, सव्व पावप्पणासणो।',
      'मंगला णं च सव्वेसिं, पढमं हवइ मंगलं॥'
    ],
    lyricsEnglish: [
      'Namo Arihantanam - I bow to the Arihantas',
      'Namo Siddhanam - I bow to the Siddhas',
      'Namo Aayariyanam - I bow to the Acharyas',
      'Namo Uvajjhayanam - I bow to the Upadhyayas',
      'Namo Loye Savva Sahunam - I bow to all the Saints',
      'Eso Pancha Namokkaro, Savva Pavappanashano',
      'Mangalanam Cha Savvesim, Padhamam Havai Mangalam'
    ],
    meaning: 'This five-fold bowing mantra destroys all sins and is the most auspicious among all sacred mantras.'
  },
  {
    id: 'bhaktamar-stotra',
    title: 'Bhaktamar Stotra',
    titleDevanagari: 'भक्तामर स्तोत्र',
    subtitle: 'Acharya Manatunga Devotion',
    metadata: 'Divine Adinath Praise',
    duration: 300, // 5:00
    coverUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    composer: 'Acharya Manatungasuri',
    raga: 'Bhairavi',
    description: 'The famous 48-verse hymn composed in deep devotion to First Tirthankara Bhagwan Adinath.',
    lyricsDevanagari: [
      'भक्तामर-प्रणत-मौली-मणि-प्रभाणा-',
      'मुद्योतकं दलित-पाप-तमो-वितानम्।',
      'सम्यक्-प्रणम्य जिन-पाद-युगं युगादा-',
      'वालम्बनं भव-जले पततां जनानाम्॥'
    ],
    lyricsEnglish: [
      'Bhaktamara-pranata-mauli-mani-prabhana-',
      'mudyotakam dalita-papa-tamo-vitanam.',
      'Samyak-pranamya jina-pada-yugam yugada-',
      'valambanam bhava-jale patatam jananam.'
    ],
    meaning: 'Bowing with devotion at the lotus feet of the Jina, which illuminate like crown jewels and dissipate all dark karmas.'
  },
  {
    id: 'uvasaggaram-stotra',
    title: 'Uvasaggaram Stotra',
    titleDevanagari: 'उवसग्गहरं स्तोत्र',
    subtitle: 'Parshvanath Devotion',
    metadata: 'Protection & Peace Chant',
    duration: 240, // 4:00
    coverUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80',
    composer: 'Acharya Bhadrabahu',
    raga: 'Yaman',
    description: 'Sacred hymn dedicated to 23rd Tirthankara Bhagwan Parshvanath for removing all obstacles and fear.',
    lyricsDevanagari: [
      'उवसग्गहरं पासं, पासं वंदामि कम्म-घण-मुक्कं।',
      'विसहर-विस-निन्नासं, मंगल-कल्लाण-आवासं॥'
    ],
    lyricsEnglish: [
      'Uvasaggaram Pasam, Pasam Vandami Kamma-Ghana-Mukkam',
      'Visahara-Visa-Ninnasam, Mangala-Kallana-Avasam'
    ],
    meaning: 'I venerate Lord Parshvanath, the destroyer of obstacles, free from dense karmas, source of supreme auspiciousness.'
  },
  {
    id: 'maitri-bhav',
    title: 'Maitri Bhav Nu Pavitra Jharun',
    titleDevanagari: 'मैत्री भाव नु पवित्र झरणुं',
    subtitle: 'Universal Peace & Compassion',
    metadata: 'Soulful Meditative Melody',
    duration: 270, // 4:30
    coverUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80',
    composer: 'Chitrabhanu Maharaj',
    raga: 'Kafi',
    description: 'A deeply moving prayer expressing friendship toward all living beings, forgiveness, and universal harmony.',
    lyricsDevanagari: [
      'मैत्री भाव नु पवित्र झरणुं मुझ हैयामां वह्या करे,',
      'शुभ थाओ आ सकल विश्वनुं एवी भावना नित्य रहे।'
    ],
    lyricsEnglish: [
      'Maitri bhav nu pavitra jharun mujhaiya ma vahya kare',
      'Shubh thao aa sakal vishvanu evi bhavana nitya rahe'
    ],
    meaning: 'May the pure stream of universal friendship flow constantly in my heart, and may good come to the entire world.'
  },
  {
    id: 'tu-mane-bhagwan',
    title: 'Tu Mane Bhagwan Ek Vardan Aape',
    titleDevanagari: 'तू मने भगवान एक वरदान आपे',
    subtitle: 'Devotional Prarthana',
    metadata: 'Soulful Meditation',
    duration: 220, // 3:40
    coverUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80',
    composer: 'Traditional Jain Prarthana',
    raga: 'Desh',
    description: 'A humble devotee praying to God for the blessing of contentment, self-realization, and non-attachment.',
    lyricsDevanagari: [
      'तू मने भगवान एक वरदान आपे,',
      'तारा नामनो जप मारा श्वासमां चाले।'
    ],
    lyricsEnglish: [
      'Tu mane bhagwan ek vardan aape,',
      'Tara naam no jap mara shvas ma chaale.'
    ],
    meaning: 'O Divine Lord, grant me one blessing: may your holy name resonate with every breath I take.'
  },
  {
    id: 'logassa-sutra',
    title: 'Logassa Sutra',
    titleDevanagari: 'लोगस्स सूत्र',
    subtitle: '24 Tirthankara Vandana',
    metadata: 'Sacred Recitation',
    duration: 180, // 3:00
    coverUrl: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80',
    composer: 'Shramana Tradition',
    raga: 'Chant / Vedic Pitch',
    description: 'Reverent salutation to the 24 Tirthankaras who illuminate the path of salvation across the cosmos.',
    lyricsDevanagari: [
      'लोगस्स उज्जोअगरे, धम्मतित्थयरे जिणे।',
      'अरिहंते कित्तइस्सं, चौवीसं पि केवली॥'
    ],
    lyricsEnglish: [
      'Logassa Ujjoagare, Dhammatitthayare Jine',
      'Arihante Kittaissam, Chauvisam Pi Kevali'
    ],
    meaning: 'I praise the 24 Arihantas, the supreme victors who enlighten the universe and establish the sacred wheel of Dharma.'
  }
];
