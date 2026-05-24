// All government schemes data
// cat: 'central' | 'state'
const schemes = [
  {
    id: 'udid',
    cat: 'central',
    icon: '🪪',
    en: {
      title: 'UDID Card (Disability ID)',
      subtitle: 'Ministry of Social Justice & Empowerment',
      steps: [
        { step: 'Go to udid.co.in OR visit nearest DDRC office', detail: '' },
        { step: 'Register with Aadhaar, photo, and disability certificate', detail: '' },
        { step: 'Submit application online or at the counter', detail: '' },
        { step: 'Free doctor checkup at DDRC', detail: 'Free of cost' },
        { step: 'UDID card delivered to your address by post', detail: 'Takes 30–45 days' },
      ],
      docs: ['Aadhaar Card', 'Disability Certificate', 'Passport Photo', 'Birth Certificate'],
    },
    hi: {
      title: 'UDID कार्ड (विकलांगता पहचान पत्र)',
      subtitle: 'सामाजिक न्याय एवं अधिकारिता मंत्रालय',
      steps: [
        { step: 'udid.co.in पर जाएँ या नज़दीकी DDRC कार्यालय जाएँ', detail: '' },
        { step: 'आधार, फोटो और विकलांगता प्रमाण पत्र से पंजीकरण करें', detail: '' },
        { step: 'ऑनलाइन या काउंटर पर आवेदन जमा करें', detail: '' },
        { step: 'DDRC में मुफ्त डॉक्टर जाँच', detail: 'मुफ्त' },
        { step: 'UDID कार्ड डाक से आपके पते पर आएगा', detail: '30–45 दिन लगते हैं' },
      ],
      docs: ['आधार कार्ड', 'विकलांगता प्रमाण पत्र', 'पासपोर्ट फोटो', 'जन्म प्रमाण पत्र'],
    },
  },
  {
    id: 'pension',
    cat: 'state',
    icon: '💰',
    en: {
      title: 'MP Divyangjan Pension Yojana',
      subtitle: 'MP Social Justice Department',
      steps: [
        { step: 'Get disability certificate showing 40%+ disability', detail: 'From CMO or PHC' },
        { step: 'Fill Form 1 at Jan Seva Kendra or District Collector office', detail: '' },
        { step: 'Attach Aadhaar, bank passbook, Samagra ID, income certificate', detail: '' },
        { step: 'SDM or Tehsildar verifies your application', detail: '' },
        { step: 'Pension credited to your bank account every month', detail: '₹600 per month' },
      ],
      docs: ['Disability Certificate (40%+)', 'Aadhaar', 'Bank Passbook', 'Samagra ID', 'Income Certificate (BPL)'],
    },
    hi: {
      title: 'MP दिव्यांगजन पेंशन योजना',
      subtitle: 'MP सामाजिक न्याय विभाग',
      steps: [
        { step: '40%+ विकलांगता का प्रमाण पत्र लें', detail: 'CMO या PHC से' },
        { step: 'जन सेवा केंद्र या जिला कलेक्टर कार्यालय में Form 1 भरें', detail: '' },
        { step: 'आधार, बैंक पासबुक, समग्र ID और आय प्रमाण पत्र लगाएँ', detail: '' },
        { step: 'SDM या तहसीलदार आवेदन की जाँच करेंगे', detail: '' },
        { step: 'पेंशन हर महीने बैंक खाते में आएगी', detail: '₹600 प्रति माह' },
      ],
      docs: ['विकलांगता प्रमाण पत्र (40%+)', 'आधार', 'बैंक पासबुक', 'समग्र ID', 'आय प्रमाण पत्र (BPL)'],
    },
  },
  {
    id: 'adip',
    cat: 'central',
    icon: '🦽',
    en: {
      title: 'Free Wheelchair & Aids (ADIP Scheme)',
      subtitle: 'Ministry of Social Justice via ALIMCO',
      steps: [
        { step: 'Apply at nearest ALIMCO camp or through our NGO', detail: '' },
        { step: 'Submit disability certificate and income proof', detail: '' },
        { step: 'Doctor assessment to decide which device you need', detail: '' },
        { step: 'Device provided free of cost', detail: 'For BPL families' },
        { step: 'We assist with follow-up and repairs', detail: '' },
      ],
      docs: ['UDID / Disability Certificate', 'Aadhaar', 'Income Proof (BPL)', 'Passport Photo'],
    },
    hi: {
      title: 'मुफ्त व्हीलचेयर और उपकरण (ADIP योजना)',
      subtitle: 'ALIMCO के माध्यम से सामाजिक न्याय मंत्रालय',
      steps: [
        { step: 'नज़दीकी ALIMCO शिविर या हमारे NGO से आवेदन करें', detail: '' },
        { step: 'विकलांगता प्रमाण पत्र और आय प्रमाण जमा करें', detail: '' },
        { step: 'डॉक्टर जाँच से उचित उपकरण तय होगा', detail: '' },
        { step: 'उपकरण मुफ्त में दिया जाएगा', detail: 'BPL परिवारों के लिए' },
        { step: 'हम मरम्मत और देखभाल में मदद करते हैं', detail: '' },
      ],
      docs: ['UDID / विकलांगता प्रमाण पत्र', 'आधार', 'आय प्रमाण (BPL)', 'पासपोर्ट फोटो'],
    },
  },
  {
    id: 'scholarship',
    cat: 'central',
    icon: '🎓',
    en: {
      title: 'Scholarship for PWD Students (NSP)',
      subtitle: 'National Scholarship Portal — Pre/Post Matric',
      steps: [
        { step: 'Register on scholarships.gov.in (NSP portal)', detail: '' },
        { step: 'Select "Pre/Post-Matric Scholarship for Disabled Students"', detail: '' },
        { step: 'Fill personal, school, and bank details', detail: '' },
        { step: 'Upload all required documents', detail: '' },
        { step: 'Submit before deadline and track status online', detail: 'Renewed every year' },
      ],
      docs: ['Disability Certificate', 'Aadhaar', 'Student Bank Account', 'Previous Marksheet', 'Income Certificate'],
    },
    hi: {
      title: 'विकलांग छात्रों के लिए छात्रवृत्ति (NSP)',
      subtitle: 'राष्ट्रीय छात्रवृत्ति पोर्टल — प्री/पोस्ट मैट्रिक',
      steps: [
        { step: 'scholarships.gov.in (NSP पोर्टल) पर पंजीकरण करें', detail: '' },
        { step: '"विकलांग छात्रों के लिए छात्रवृत्ति" चुनें', detail: '' },
        { step: 'व्यक्तिगत, स्कूल और बैंक विवरण भरें', detail: '' },
        { step: 'सभी आवश्यक दस्तावेज़ अपलोड करें', detail: '' },
        { step: 'समय पर जमा करें और स्थिति ऑनलाइन ट्रैक करें', detail: 'हर साल नवीनीकरण' },
      ],
      docs: ['विकलांगता प्रमाण पत्र', 'आधार', 'छात्र बैंक खाता', 'पिछली मार्कशीट', 'आय प्रमाण पत्र'],
    },
  },
  {
    id: 'job',
    cat: 'state',
    icon: '💼',
    en: {
      title: 'Government Job Reservation (4%)',
      subtitle: 'MP Rojgar Portal — State Govt.',
      steps: [
        { step: 'Get UDID Card and disability certificate (40%+)', detail: '' },
        { step: 'Register on mprojgar.gov.in', detail: '' },
        { step: 'Apply for vacancies marked with PWD quota (4% reservation)', detail: '' },
        { step: 'Attend exam or interview with your UDID card', detail: '' },
        { step: 'Submit documents to HR department after appointment', detail: '' },
      ],
      docs: ['UDID Card', 'Disability Certificate (40%+)', 'Aadhaar', 'Educational Certificates', 'MP Domicile Certificate'],
    },
    hi: {
      title: 'सरकारी नौकरी आरक्षण (4%)',
      subtitle: 'MP रोजगार पोर्टल',
      steps: [
        { step: 'UDID कार्ड और विकलांगता प्रमाण पत्र (40%+) प्राप्त करें', detail: '' },
        { step: 'mprojgar.gov.in पर पंजीकरण करें', detail: '' },
        { step: 'PWD कोटा (4% आरक्षण) की रिक्तियों में आवेदन करें', detail: '' },
        { step: 'UDID कार्ड के साथ परीक्षा या साक्षात्कार दें', detail: '' },
        { step: 'नियुक्ति के बाद HR विभाग में दस्तावेज़ जमा करें', detail: '' },
      ],
      docs: ['UDID कार्ड', 'विकलांगता प्रमाण पत्र (40%+)', 'आधार', 'शैक्षणिक प्रमाण पत्र', 'MP अधिवास प्रमाण पत्र'],
    },
  },
  {
    id: 'ayushman',
    cat: 'central',
    icon: '🏥',
    en: {
      title: 'Ayushman Bharat (Free Healthcare)',
      subtitle: 'PMJAY — ₹5 lakh per family per year',
      steps: [
        { step: 'Check eligibility on pmjay.gov.in or call 14555', detail: '' },
        { step: 'Get Ayushman Card from Jan Seva Kendra', detail: 'Free' },
        { step: 'Visit any empanelled hospital', detail: '' },
        { step: 'Show card and get cashless treatment', detail: 'Up to ₹5 lakh / year' },
        { step: 'No paperwork required at the hospital', detail: '' },
      ],
      docs: ['Aadhaar', 'Ration Card', 'Mobile Number', 'Family Details'],
    },
    hi: {
      title: 'आयुष्मान भारत (मुफ्त इलाज)',
      subtitle: 'PMJAY — ₹5 लाख प्रति परिवार प्रति वर्ष',
      steps: [
        { step: 'pmjay.gov.in पर पात्रता देखें या 14555 पर कॉल करें', detail: '' },
        { step: 'जन सेवा केंद्र से आयुष्मान कार्ड बनवाएँ', detail: 'मुफ्त' },
        { step: 'किसी भी सूचीबद्ध अस्पताल जाएँ', detail: '' },
        { step: 'कार्ड दिखाएँ और कैशलेस इलाज पाएँ', detail: '₹5 लाख / वर्ष तक' },
        { step: 'अस्पताल में कोई कागज़ी काम नहीं', detail: '' },
      ],
      docs: ['आधार', 'राशन कार्ड', 'मोबाइल नंबर', 'परिवार विवरण'],
    },
  },
]

export default schemes
