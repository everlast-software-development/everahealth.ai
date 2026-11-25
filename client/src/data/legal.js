// The text of the Privacy Policy and the Terms & Conditions pages (/privacy-policy, /terms-and-conditions).
// Edit the wording here; the page layout is in src/legal/Legal.jsx.
//
// A section's "blocks" are, in order:
//   'text'                         a paragraph
//   { sub: 'text' }                a small heading inside the section
//   { list: ['text', ['Lead-in.', 'text']] }   a bulleted list; a pair shows its first part in bold
//   { note: 'text', title: '…' }   a highlighted notice
//   { contact: true }              how to reach Evera (phone and address come from data/landing.js)
//
// IMPORTANT: have a UAE lawyer review both documents before going live, and update UPDATED whenever the text changes.

export const UPDATED = '25 November 2026';

export const privacy = {
  path: '/privacy-policy',
  label: 'Privacy Policy',
  title: ['Privacy', 'Policy'],                  // [white part, gradient part]
  description: 'How Evera AI collects, uses, protects and deletes your personal and health information in the Evera AI app and on this website.',
  intro: 'Your health information is among the most personal things you own. This policy explains, in plain words, what Evera AI collects, why, who sees it, and the control you have over it.',
  summary: [
    'You decide what to upload. Evera AI only analyses the reports, photos and details you choose to give it.',
    'We use your health information to give you your analyses and insights, not for advertising.',
    'We do not sell your personal information.',
    'You can ask for a copy of your information, correct it, or delete it and your account at any time.',
    'This website does not use advertising or tracking cookies.',
  ],
  sections: [
    {
      id: 'who-we-are', title: 'Who we are',
      blocks: [
        'Evera AI (“Evera”, “we”, “us”) is an AI health assistant based in Abu Dhabi, United Arab Emirates. We are responsible for the personal information described in this policy.',
        'This policy covers the Evera AI mobile app, this website and any message you send us. By using them, you agree to the practices described here. If you do not agree, please do not use the app or the website.',
      ],
    },
    {
      id: 'what-we-collect', title: 'The information we collect',
      blocks: [
        { sub: 'Information you give us' },
        { list: [
          ['Account details.', 'Your name, email address, phone number and the sign-in details for your account.'],
          ['Profile details.', 'Information such as your age, sex, height, weight and health goals, which make your results more accurate.'],
          ['Health records.', 'The lab reports and test results you upload (as PDFs or images), and the prescriptions and medical documents you keep in your Medical Wallet.'],
          ['Photos and scans.', 'Selfies and face scans for skin and face analysis, body measurements, and photos of your meals.'],
          ['Your conversations.', 'The questions you ask the Evera assistant and the answers it gives you.'],
          ['Messages to us.', 'When you use the contact form on this website: your name, email address, phone number (optional), subject and message.'],
        ] },
        { sub: 'Information collected automatically' },
        { list: [
          ['Device and app information.', 'Your device type, operating system, app version, language and time zone.'],
          ['Usage and diagnostics.', 'Which features you use, and error and crash reports that help us fix problems.'],
          ['Network information.', 'Your IP address, which our servers receive whenever your device connects to them.'],
        ] },
        { sub: 'Payments' },
        'Paid plans are bought through the app store or payment provider shown at checkout. They process your payment; we do not receive or store your full card number. We receive confirmation of your plan and its status.',
        { sub: 'This website' },
        'This website does not use advertising or tracking cookies. It loads its fonts from Google Fonts, so Google receives your IP address when a page loads. Our server also uses your IP address for a short time to limit spam through the contact form.',
      ],
    },
    {
      id: 'health-data', title: 'Health and sensitive information',
      blocks: [
        'Lab results, medical documents, face and skin images and body measurements are sensitive information. We process them only with your consent, and only to provide the features you choose to use.',
        'You are always in control: nothing is analysed unless you upload it, and you can withdraw your consent at any time by deleting the item, or your whole account, in the app. Withdrawing consent does not affect processing that already took place.',
        { note: 'Please upload only your own information, or information you have permission to share, such as a family member’s report with their agreement.' },
      ],
    },
    {
      id: 'how-we-use', title: 'How we use your information',
      blocks: [
        { list: [
          'To read your reports, photos and measurements and give you your analyses, explanations and insights.',
          'To track your results over time and show you trends and progress.',
          'To personalise recommendations, nutrition plans and skincare routines for you.',
          'To create and manage your account and your plan.',
          'To answer your questions and support requests.',
          'To keep the service safe, prevent misuse and fix problems.',
          'To maintain and improve the service and the accuracy of our analyses, using aggregated or de-identified information wherever we can.',
          'To meet our legal obligations.',
        ] },
        'We do not use your health information for advertising, and we do not sell your personal information.',
        'We rely on your consent to process health and other sensitive information. We process the rest because it is needed to provide the service you asked for, to keep it secure and working, or to comply with the law.',
      ],
    },
    {
      id: 'sharing', title: 'Who we share it with',
      blocks: [
        'We share personal information only where it is needed, with:',
        { list: [
          ['Service providers.', 'Companies that help us run Evera AI, such as hosting, storage, AI processing, diagnostics and customer support. They may use your information only to provide their service to us, under contracts that require them to protect it.'],
          ['App stores and payment providers.', 'To process purchases and confirm the status of your plan.'],
          ['Authorities and advisers.', 'When the law requires it, or when it is needed to protect the rights, safety or property of our users, the public or Evera.'],
          ['A successor business.', 'If Evera AI is involved in a merger, acquisition or sale of assets, your information may be transferred. We will tell you before it becomes subject to a different privacy policy.'],
          ['Anyone you choose.', 'When you export or share a report or result yourself.'],
        ] },
      ],
    },
    {
      id: 'transfers', title: 'International transfers',
      blocks: [
        'Some of our service providers operate outside the United Arab Emirates, so your information may be processed in other countries. When that happens, we take the steps the law requires to keep it protected.',
      ],
    },
    {
      id: 'security', title: 'How we protect it',
      blocks: [
        'Your records are encrypted, and access to them is limited to the people and systems that need it to run the service.',
        'No system can be guaranteed to be completely secure. Please use a strong, unique password, keep your device protected, and tell us straight away if you think someone has accessed your account without permission.',
      ],
    },
    {
      id: 'retention', title: 'How long we keep it',
      blocks: [
        'We keep your information for as long as your account is open, so that you can see your history and progress.',
        'When you delete an item or your account, we delete or de-identify the related information within a reasonable period, unless the law requires us to keep some of it for longer. Copies in backups are removed as those backups expire.',
        'Messages sent through the contact form are kept for as long as needed to answer you and to keep a record of our correspondence.',
      ],
    },
    {
      id: 'your-rights', title: 'Your choices and rights',
      blocks: [
        'Subject to the law that applies to you, you can:',
        { list: [
          'Ask for a copy of the personal information we hold about you.',
          'Ask us to correct information that is wrong or incomplete.',
          'Delete your information and your account.',
          'Withdraw your consent to the processing of your health information.',
          'Object to, or ask us to restrict, certain uses of your information.',
          'Complain to the data protection authority in your country.',
        ] },
        'Most of these can be done in the app’s settings. You can also contact us using the details at the end of this policy. We may need to confirm your identity before acting on a request, and we will reply within the time the law requires.',
      ],
    },
    {
      id: 'children', title: 'Children',
      blocks: [
        'Evera AI is intended for adults aged 18 and over. We do not knowingly collect personal information from anyone under 18. If you believe a child has given us their information, please contact us and we will delete it.',
      ],
    },
    {
      id: 'third-parties', title: 'Links and other services',
      blocks: [
        'The app and this website link to services we do not control, such as the App Store, Google Play and social networks. Their own privacy policies apply to what they collect; please read them.',
      ],
    },
    {
      id: 'changes', title: 'Changes to this policy',
      blocks: [
        'We may update this policy as the service or the law changes. The date at the top shows when it was last updated. If a change is significant, we will tell you in the app or on this website before it takes effect.',
      ],
    },
    {
      id: 'contact', title: 'Contact us',
      blocks: [
        'If you have a question about this policy or about your information, or you want to use any of your rights, get in touch:',
        { contact: true },
      ],
    },
  ],
};

export const terms = {
  path: '/terms-and-conditions',
  label: 'Terms & Conditions',
  title: ['Terms &', 'Conditions'],
  description: 'The terms that apply when you use the Evera AI app and website: what the service is, your account, plans and payment, and the limits of what Evera AI provides.',
  intro: 'These terms are the agreement between you and Evera AI. Please read them before you use the app or this website.',
  summary: [
    'Evera AI helps you understand your health. It does not replace a doctor and is not for emergencies.',
    'What you upload stays yours. You give us permission to process it so we can provide the service.',
    'Paid plans renew automatically until you cancel.',
    'You must be 18 or over to use Evera AI.',
    'These terms are governed by the laws of the United Arab Emirates.',
  ],
  sections: [
    {
      id: 'agreement', title: 'Your agreement with us',
      blocks: [
        'These terms apply to the Evera AI mobile app, this website and any related services (together, the “service”), provided by Evera AI (“Evera”, “we”, “us”), based in Abu Dhabi, United Arab Emirates.',
        'By downloading the app, creating an account or using the service, you agree to these terms and to our Privacy Policy. If you do not agree, please do not use the service.',
      ],
    },
    {
      id: 'the-service', title: 'What Evera AI is',
      blocks: [
        'Evera AI is an AI health assistant. It reads the lab reports you upload and explains them in plain language, analyses photos of your skin, face and meals, tracks your body composition and results over time, keeps your medical documents in one place, and suggests nutrition and skincare plans based on your information.',
      ],
    },
    {
      id: 'medical', title: 'Not a substitute for medical care',
      blocks: [
        { title: 'Important.', note: 'Evera AI gives you information to help you understand your health. It does not replace a doctor, and its analyses and recommendations are not a medical diagnosis, treatment or prescription.' },
        { list: [
          'Always ask a qualified healthcare professional about a medical condition, a test result or a change to your medication, diet or treatment.',
          'Never ignore professional medical advice, or delay seeking it, because of something you read in Evera AI.',
          'Analyses are produced by artificial intelligence from the information you provide. They can be incomplete or wrong, and their quality depends on the quality of what you upload.',
          'Evera AI is not for emergencies. If you think you may have a medical emergency, call your local emergency number or go to the nearest hospital straight away.',
        ] },
      ],
    },
    {
      id: 'eligibility', title: 'Who can use Evera AI',
      blocks: [
        'You must be at least 18 years old and able to enter into a binding agreement. You agree to give accurate information about yourself and to keep it up to date.',
      ],
    },
    {
      id: 'account', title: 'Your account',
      blocks: [
        'You are responsible for keeping your sign-in details confidential and for what happens under your account. Tell us straight away if you think someone has used your account without your permission.',
      ],
    },
    {
      id: 'your-content', title: 'What you upload',
      blocks: [
        'The reports, photos, documents and other information you upload remain yours. You give us permission to store and process them in order to provide the service to you, as described in our Privacy Policy.',
        'You confirm that what you upload is your own, or that you have the right or the person’s permission to share it with us.',
      ],
    },
    {
      id: 'acceptable-use', title: 'Using the service fairly',
      blocks: [
        'You agree not to:',
        { list: [
          'Use the service for anything unlawful, harmful or misleading.',
          'Upload another person’s health information without their permission.',
          'Try to gain unauthorised access to the service, other accounts or our systems.',
          'Copy, modify, reverse engineer or resell the service or any part of it.',
          'Use bots, scrapers or other automated tools to access the service.',
          'Interfere with the service, or upload viruses or other harmful code.',
        ] },
      ],
    },
    {
      id: 'plans', title: 'Plans, payment and cancellation',
      blocks: [
        'Evera AI offers a free plan and paid plans. The features and price of each plan are shown before you buy.',
        { list: [
          ['Billing.', 'Paid plans are charged in advance for the period you choose (monthly or yearly), through the app store or payment provider shown at checkout.'],
          ['Renewal.', 'A paid plan renews automatically at the end of each period, at the price then in effect, until you cancel.'],
          ['Cancelling.', 'You can cancel at any time in your app store’s subscription settings. Your plan stays active until the end of the period you have paid for.'],
          ['Refunds.', 'Purchases made through an app store are handled under that store’s refund policy. Nothing in these terms limits any refund rights you have under the law.'],
          ['Price changes.', 'We may change our prices. We will tell you in advance, and the new price applies from your next renewal.'],
        ] },
      ],
    },
    {
      id: 'ownership', title: 'Our content and brand',
      blocks: [
        'The app, this website, the Evera name and logo, and all the software, designs and content we provide belong to Evera AI or its licensors and are protected by law. We give you a personal, non-transferable, non-exclusive right to use the service for your own, non-commercial use, in line with these terms.',
      ],
    },
    {
      id: 'third-party', title: 'Other companies’ services',
      blocks: [
        'The service relies on, and links to, services run by other companies, such as the App Store and Google Play. Your use of those services is subject to their own terms, and we are not responsible for them.',
      ],
    },
    {
      id: 'changes-to-service', title: 'Changes and availability',
      blocks: [
        'We are always improving Evera AI, so features may be added, changed or removed. We may also suspend the service for maintenance, security or reasons outside our control. We will try to give you notice of significant changes.',
      ],
    },
    {
      id: 'disclaimers', title: 'No guarantees',
      blocks: [
        'We work to make Evera AI accurate and reliable, but the service is provided “as is” and “as available”. To the extent the law allows, we do not guarantee that it will be uninterrupted or free of errors, or that its analyses, insights and recommendations will be accurate, complete or suitable for your situation.',
      ],
    },
    {
      id: 'liability', title: 'Limits on our liability',
      blocks: [
        'To the extent the law allows:',
        { list: [
          'We are not liable for indirect or consequential losses, or for loss of data, profits or opportunity.',
          'We are not liable for decisions you make, or actions you take or do not take, based on information from the service.',
          'Our total liability to you for any claim connected with the service is limited to the amount you paid us in the 12 months before the claim arose.',
        ] },
        'Nothing in these terms excludes or limits liability that cannot be excluded or limited by law.',
      ],
    },
    {
      id: 'ending', title: 'Ending your use',
      blocks: [
        'You can stop using Evera AI and delete your account at any time. We may suspend or close your account if you break these terms or use the service in a way that could cause harm. Where it is reasonable, we will tell you first.',
        'The sections of these terms that by their nature should continue, such as those on ownership, disclaimers and liability, continue to apply after your use ends.',
      ],
    },
    {
      id: 'law', title: 'Governing law',
      blocks: [
        'These terms are governed by the laws of the United Arab Emirates as applied in the Emirate of Abu Dhabi. Any dispute will be handled by the courts of Abu Dhabi, unless the law gives you the right to bring it elsewhere.',
      ],
    },
    {
      id: 'changes', title: 'Changes to these terms',
      blocks: [
        'We may update these terms from time to time. The date at the top shows when they were last updated. If a change is significant, we will tell you in the app or on this website before it takes effect. If you keep using the service after that, you accept the updated terms.',
      ],
    },
    {
      id: 'contact', title: 'Contact us',
      blocks: [
        'If you have a question about these terms, get in touch:',
        { contact: true },
      ],
    },
  ],
};

export const legal = { privacy, terms };
