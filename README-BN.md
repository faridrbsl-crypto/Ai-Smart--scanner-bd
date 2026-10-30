# AI Smart Scanner BD — প্রস্তুত প্রকল্প

এটি একটি মোবাইল-ফ্রেন্ডলি ওয়েব অ্যাপ/PWA। Android-এ Chrome থেকে Install app বা Add to Home screen দিয়ে ইনস্টল করা যায়। আলাদা Play Store APK নয়।

## কী আছে
- ক্যামেরা/গ্যালারি থেকে ছবি নেওয়া
- খাবার শনাক্ত ও আনুমানিক ক্যালরি, প্রোটিন, কার্বোহাইড্রেট, ফ্যাট, ফাইবার
- সাধারণ পণ্য শনাক্ত ও বাংলাদেশি টাকায় সতর্কতাসহ আনুমানিক দাম
- বাংলা/ইংরেজি
- Netlify Function-এর মাধ্যমে OpenAI API কল; API key ব্রাউজারে প্রকাশ হয় না
- PWA manifest ও service worker

## প্রকাশের আগে প্রয়োজনীয় কাজ
1. ZIP ফাইলটি Extract করে GitHub-এ একটি নতুন repository তৈরি করুন, যেমন `ai-smart-scanner-bd`।
2. এই ফোল্ডারের সব ফাইল GitHub repository-তে Upload করুন (ফোল্ডার কাঠামো অক্ষুণ্ণ রাখুন)।
3. Netlify-তে **Add new site → Import an existing project → GitHub** নির্বাচন করে repository যুক্ত করুন।
4. Netlify Site configuration / Environment variables-এ `OPENAI_API_KEY` নামে variable যোগ করুন। Value হিসেবে আপনার OpenAI secret key দিন। এটি HTML/JavaScript-এ কখনো লিখবেন না।
5. Deploy করুন। Deploy সফল হলে সাইটের URL খুলে ছবি দিয়ে পরীক্ষা করুন।
6. Android Chrome-এ সাইট খুলে মেনু থেকে **Install app** অথবা **Add to Home screen** চাপুন।

## বিদ্যমান Food Scanner BD সাইট নিরাপদ রাখা
এই প্রকল্পটি আলাদা নতুন GitHub repository ও আলাদা Netlify site হিসেবে deploy করুন। পুরোনো সাইটের repository বা deploy মুছবেন/overwrite করবেন না। সব ঠিকমতো পরীক্ষা করার পর চাইলে domain পরিবর্তন করবেন।

## খরচ ও সীমাবদ্ধতা
- এই source code বিনামূল্যে ব্যবহারযোগ্য; GitHub/Netlify-এর free tier-এ সীমা ও শর্ত থাকতে পারে।
- OpenAI API সাধারণত ব্যবহারভিত্তিক বিল করে; ফ্রি ব্যবহারের নিশ্চয়তা নেই। Usage limit/budget alert সেট করুন।
- পণ্যের দাম ছবির ভিত্তিতে AI অনুমান করে; লাইভ দোকানের মূল্য নয়। নির্ভুল লাইভ মূল্য পেতে পরবর্তীতে নির্ভরযোগ্য পণ্যের ডেটা/API যুক্ত করতে হবে।
- খাবারের ক্যালরি ও পুষ্টি আনুমানিক; ওজন/পরিমাণ ও রান্নার উপকরণ না জানলে ভুল হতে পারে।
- এই প্রকল্প Android PWA। Google Play Store-এ প্রকাশের জন্য আলাদা Android packaging, পরীক্ষা ও Play Console account প্রয়োজন।

## নিরাপত্তা
- `OPENAI_API_KEY` শুধুমাত্র Netlify Environment Variables-এ রাখুন।
- API key কাউকে পাঠাবেন না, GitHub-এ commit করবেন না।
- Function-এ rate limit/abuse protection ও user authentication যোগ করা হয়নি; public launch-এর আগে এগুলো বিবেচনা করুন।
