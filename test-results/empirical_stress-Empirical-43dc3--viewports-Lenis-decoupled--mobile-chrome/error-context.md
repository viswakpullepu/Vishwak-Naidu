# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: empirical_stress.spec.js >> Empirical Stress Testing of Interactive & Dynamic CSS Behaviors >> Scenario 3: Nav scrollspy active highlighting on mobile viewports (Lenis decoupled)
- Location: tests\empirical_stress.spec.js:90:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "#skills"
Received: "#about"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - paragraph [ref=e4]:
    - generic [ref=e5]: L
    - generic [ref=e6]: O
    - generic [ref=e7]: A
    - generic [ref=e8]: D
    - generic [ref=e9]: I
    - generic [ref=e10]: "N"
    - generic [ref=e11]: G
    - generic [ref=e12]: P
    - generic [ref=e13]: O
    - generic [ref=e14]: R
    - generic [ref=e15]: T
    - generic [ref=e16]: F
    - generic [ref=e17]: O
    - generic [ref=e18]: L
    - generic [ref=e19]: I
    - generic [ref=e20]: O
  - text:   
  - banner [ref=e23]:
    - link "VN | Creative Developer" [ref=e25] [cursor=pointer]:
      - /url: "#"
    - button "Open Navigation Menu" [ref=e26] [cursor=pointer]:
      - generic [ref=e27]: 
  - generic [ref=e28]:
    - button "Close Navigation Menu" [ref=e29] [cursor=pointer]:
      - generic [ref=e30]: 
    - list [ref=e31]:
      - listitem [ref=e32]:
        - link "About" [ref=e33] [cursor=pointer]:
          - /url: "#about"
      - listitem [ref=e34]:
        - link "Skills" [ref=e35] [cursor=pointer]:
          - /url: "#skills"
      - listitem [ref=e36]:
        - link "Certifications" [ref=e37] [cursor=pointer]:
          - /url: "#certifications"
      - listitem [ref=e38]:
        - link "Academic Background" [ref=e39] [cursor=pointer]:
          - /url: "#academics"
      - listitem [ref=e40]:
        - link "Projects" [ref=e41] [cursor=pointer]:
          - /url: "#projects"
      - listitem [ref=e42]:
        - link "GitHub" [ref=e43] [cursor=pointer]:
          - /url: "#github-activity"
      - listitem [ref=e44]:
        - link "Live Apps" [ref=e45] [cursor=pointer]:
          - /url: "#vercel"
      - listitem [ref=e46]:
        - link "Highlights" [ref=e47] [cursor=pointer]:
          - /url: "#highlights"
      - listitem [ref=e48]:
        - link "Contact" [ref=e49] [cursor=pointer]:
          - /url: "#contact"
  - main [ref=e50]:
    - generic [ref=e51]:
      - generic:
        - paragraph [ref=e52]: Hello, I'm
        - heading "V i s h w a k P u l l e p u" [level=1] [ref=e53]:
          - generic [ref=e54]:
            - generic [ref=e55]: V
            - generic [ref=e56]: i
            - generic [ref=e57]: s
            - generic [ref=e58]: h
            - generic [ref=e59]: w
            - generic [ref=e60]: a
            - generic [ref=e61]: k
          - generic [ref=e62]:
            - generic [ref=e63]: P
            - generic [ref=e64]: u
            - generic [ref=e65]: l
            - generic [ref=e66]: l
            - generic [ref=e67]: e
            - generic [ref=e68]: p
            - generic [ref=e69]: u
        - paragraph [ref=e70]: Cybersecurity Enthusiast • AI Explorer • Web Developer
        - paragraph [ref=e71]: Building secure, intelligent, and scalable digital experiences through cybersecurity, artificial intelligence, and modern web technologies.
        - link "Explore Portfolio " [ref=e72] [cursor=pointer]:
          - /url: "#about"
          - generic [ref=e73]: Explore Portfolio
          - generic [ref=e74]: 
    - generic [ref=e76]:
      - generic [ref=e77]:
        - generic [ref=e78]: Who I Am
        - heading "About Me" [level=2] [ref=e79]
      - generic [ref=e80]:
        - img "Vishwak Pullepu" [ref=e82]
        - generic [ref=e84]:
          - generic [ref=e85]:
            - generic [ref=e86]:
              - generic [ref=e87]: 
              - generic [ref=e88]: B.Tech Computer Science Student
            - generic [ref=e89]:
              - generic [ref=e90]: 
              - generic [ref=e91]: Cybersecurity Enthusiast
            - generic [ref=e92]:
              - generic [ref=e93]: 
              - generic [ref=e94]: AI Explorer
            - generic [ref=e95]:
              - generic [ref=e96]: 
              - generic [ref=e97]: Full-Stack Web Developer
            - generic [ref=e98]:
              - generic [ref=e99]: 
              - generic [ref=e100]: Continuous Learner
          - paragraph [ref=e101]: I am a Computer Science student passionate about Cybersecurity, Artificial Intelligence, and Web Development. I enjoy building secure digital solutions, exploring emerging technologies, and solving real-world problems through practical projects and continuous learning.
    - generic [ref=e102]:
      - generic [ref=e103]:
        - generic [ref=e104]: Technologies & Tools
        - heading "My Arsenal" [level=2] [ref=e105]
      - generic [ref=e106]:
        - generic [ref=e109]:
          - img [ref=e111]
          - img [ref=e113]
          - img [ref=e115]
          - img [ref=e117]
          - img [ref=e119]
          - img [ref=e121]
          - img [ref=e123]
          - img [ref=e125]
          - img [ref=e127]
          - img [ref=e129]
          - img [ref=e131]
          - img [ref=e133]
          - img [ref=e135]
          - img [ref=e137]
          - img [ref=e139]
          - img [ref=e141]
          - img [ref=e143]
          - generic [ref=e145]: 
          - generic [ref=e147]: 
          - generic [ref=e149]: 
          - generic [ref=e151]: 
          - generic [ref=e153]: 
          - generic [ref=e155]: 
          - generic [ref=e157]: 
          - generic [ref=e159]: 
          - generic [ref=e161]: 
          - generic [ref=e163]: 
          - generic [ref=e165]: 
          - generic [ref=e167]: 
          - generic [ref=e169]: 
          - generic [ref=e171]: 
          - generic [ref=e173]: 
          - generic [ref=e175]: 
          - generic [ref=e177]: 
          - generic [ref=e179]: 
          - generic [ref=e181]: 
          - generic [ref=e183]: 
          - generic [ref=e185]: 
          - generic [ref=e187]: 
          - generic [ref=e189]: 
          - generic [ref=e191]: 
          - generic [ref=e193]: 
          - generic [ref=e195]: 
          - generic [ref=e197]: 
          - generic [ref=e199]: 
          - generic [ref=e201]: 
          - generic [ref=e203]: 
          - generic [ref=e205]: 
          - generic [ref=e207]: 
          - generic [ref=e209]: 
          - generic [ref=e211]: 
          - generic [ref=e213]: 
          - generic [ref=e215]: 
          - generic [ref=e217]: 
          - generic [ref=e219]: 
          - generic [ref=e221]: 
          - generic [ref=e223]: 
          - generic [ref=e225]: 
          - generic [ref=e227]: 
          - generic [ref=e229]: 
          - generic [ref=e231]: 
          - generic [ref=e233]: 
          - generic [ref=e235]: 
          - generic [ref=e237]: 
          - generic [ref=e239]: 
          - generic [ref=e241]: 
          - generic [ref=e243]: 
          - generic [ref=e245]: 
          - generic [ref=e247]: 
          - generic [ref=e249]: 
          - generic [ref=e251]: 
          - generic [ref=e253]: 
        - generic [ref=e254]:
          - generic [ref=e255]:
            - heading "AI Models & Tools" [level=4] [ref=e256]
            - generic [ref=e257]:
              - generic [ref=e258] [cursor=pointer]:
                - img "ChatGPT" [ref=e259]
                - generic [ref=e260]: ChatGPT
              - generic [ref=e261] [cursor=pointer]:
                - img "Gemini" [ref=e262]
                - generic [ref=e263]: Gemini
              - generic [ref=e264] [cursor=pointer]:
                - img "Claude" [ref=e265]
                - generic [ref=e266]: Claude
              - generic [ref=e267] [cursor=pointer]:
                - img "Copilot" [ref=e268]
                - generic [ref=e269]: Copilot
              - generic [ref=e270] [cursor=pointer]:
                - img "Hugging Face" [ref=e271]
                - generic [ref=e272]: Hugging Face
              - generic [ref=e273] [cursor=pointer]:
                - img "Midjourney" [ref=e274]
                - generic [ref=e275]: Midjourney
              - generic [ref=e276] [cursor=pointer]:
                - img "LLaMA" [ref=e277]
                - generic [ref=e278]: LLaMA
              - generic [ref=e279] [cursor=pointer]:
                - img "DALL-E" [ref=e280]
                - generic [ref=e281]: DALL-E
              - generic [ref=e282] [cursor=pointer]:
                - img "Perplexity" [ref=e283]
                - generic [ref=e284]: Perplexity
              - generic [ref=e285] [cursor=pointer]:
                - img "Stable Diffusion" [ref=e286]
                - generic [ref=e287]: Stable Diffusion
              - generic [ref=e288] [cursor=pointer]:
                - img "Notion AI" [ref=e289]
                - generic [ref=e290]: Notion AI
              - generic [ref=e291] [cursor=pointer]:
                - img "Jasper AI" [ref=e292]
                - generic [ref=e293]: Jasper AI
              - generic [ref=e294] [cursor=pointer]:
                - img "RunwayML" [ref=e295]
                - generic [ref=e296]: RunwayML
              - generic [ref=e297] [cursor=pointer]:
                - img "v0" [ref=e298]
                - generic [ref=e299]: v0
              - generic [ref=e300] [cursor=pointer]:
                - img "Mistral" [ref=e301]
                - generic [ref=e302]: Mistral
              - generic [ref=e303] [cursor=pointer]:
                - img "Leonardo" [ref=e304]
                - generic [ref=e305]: Leonardo
              - generic [ref=e306] [cursor=pointer]:
                - img "Copy.ai" [ref=e307]
                - generic [ref=e308]: Copy.ai
          - generic [ref=e309]:
            - heading "Frameworks & Tools" [level=4] [ref=e310]
            - generic [ref=e311]:
              - generic [ref=e312] [cursor=pointer]:
                - generic [ref=e313]: 
                - generic [ref=e314]: React
              - generic [ref=e315] [cursor=pointer]:
                - generic [ref=e316]: 
                - generic [ref=e317]: Node.js
              - generic [ref=e320] [cursor=pointer]: Next.js
              - generic [ref=e321] [cursor=pointer]:
                - generic [ref=e322]: 
                - generic [ref=e323]: Tailwind
              - generic [ref=e324] [cursor=pointer]:
                - generic [ref=e325]: 
                - generic [ref=e326]: Express
              - generic [ref=e327] [cursor=pointer]:
                - generic [ref=e328]: 
                - generic [ref=e329]: Spring Boot
              - generic [ref=e330] [cursor=pointer]:
                - generic [ref=e331]: 
                - generic [ref=e332]: Git
              - generic [ref=e333] [cursor=pointer]:
                - generic [ref=e334]: 
                - generic [ref=e335]: GitHub
              - generic [ref=e336] [cursor=pointer]:
                - generic [ref=e337]: 
                - generic [ref=e338]: Docker
              - generic [ref=e339] [cursor=pointer]:
                - generic [ref=e340]: 
                - generic [ref=e341]: Figma
              - generic [ref=e342] [cursor=pointer]:
                - generic [ref=e343]: 
                - generic [ref=e344]: VS Code
              - generic [ref=e345] [cursor=pointer]:
                - generic [ref=e346]: 
                - generic [ref=e347]: Postman
              - generic [ref=e348] [cursor=pointer]:
                - generic [ref=e349]: 
                - generic [ref=e350]: Vue.js
              - generic [ref=e351] [cursor=pointer]:
                - generic [ref=e352]: 
                - generic [ref=e353]: Angular
              - generic [ref=e354] [cursor=pointer]:
                - generic [ref=e355]: 
                - generic [ref=e356]: Svelte
              - generic [ref=e357] [cursor=pointer]:
                - generic [ref=e358]: 
                - generic [ref=e359]: jQuery
              - generic [ref=e360] [cursor=pointer]:
                - generic [ref=e361]: 
                - generic [ref=e362]: Android
              - generic [ref=e363] [cursor=pointer]:
                - generic [ref=e364]: 
                - generic [ref=e365]: iOS
              - generic [ref=e366] [cursor=pointer]:
                - generic [ref=e367]: 
                - generic [ref=e368]: Chrome
              - generic [ref=e369] [cursor=pointer]:
                - generic [ref=e370]: 
                - generic [ref=e371]: Slack
              - generic [ref=e372] [cursor=pointer]:
                - generic [ref=e373]: 
                - generic [ref=e374]: Trello
              - generic [ref=e375] [cursor=pointer]:
                - generic [ref=e376]: 
                - generic [ref=e377]: Jira
              - generic [ref=e378] [cursor=pointer]:
                - generic [ref=e379]: 
                - generic [ref=e380]: Markdown
              - generic [ref=e381] [cursor=pointer]:
                - generic [ref=e382]: 
                - generic [ref=e383]: JSON
              - generic [ref=e384] [cursor=pointer]:
                - generic [ref=e385]: 
                - generic [ref=e386]: WordPress
              - generic [ref=e387] [cursor=pointer]:
                - generic [ref=e388]: 
                - generic [ref=e389]: Webflow
              - generic [ref=e392] [cursor=pointer]: Discord
              - generic [ref=e393] [cursor=pointer]:
                - generic [ref=e394]: 
                - generic [ref=e395]: GitLab
              - generic [ref=e396] [cursor=pointer]:
                - generic [ref=e397]: 
                - generic [ref=e398]: Bitbucket
          - generic [ref=e399]:
            - heading "Cloud, AI & Security" [level=4] [ref=e400]
            - generic [ref=e401]:
              - generic [ref=e402] [cursor=pointer]:
                - generic [ref=e403]: 
                - generic [ref=e404]: AWS
              - generic [ref=e405] [cursor=pointer]:
                - generic [ref=e406]: 
                - generic [ref=e407]: Azure
              - generic [ref=e408] [cursor=pointer]:
                - generic [ref=e409]: 
                - generic [ref=e410]: MongoDB
              - generic [ref=e411] [cursor=pointer]:
                - generic [ref=e412]: 
                - generic [ref=e413]: PostgreSQL
              - generic [ref=e414] [cursor=pointer]:
                - generic [ref=e415]: 
                - generic [ref=e416]: Firebase
              - generic [ref=e417] [cursor=pointer]:
                - generic [ref=e418]: 
                - generic [ref=e419]: TensorFlow
              - generic [ref=e420] [cursor=pointer]:
                - generic [ref=e421]: 
                - generic [ref=e422]: PyTorch
              - generic [ref=e423] [cursor=pointer]:
                - generic [ref=e424]: 
                - generic [ref=e425]: OpenCV
              - generic [ref=e428] [cursor=pointer]: NumPy
              - generic [ref=e431] [cursor=pointer]: Pandas
              - generic [ref=e432] [cursor=pointer]:
                - generic [ref=e433]: 
                - generic [ref=e434]: Linux
              - generic [ref=e435] [cursor=pointer]:
                - generic [ref=e436]: 
                - generic [ref=e437]: Security
              - generic [ref=e438] [cursor=pointer]:
                - generic [ref=e439]: 
                - generic [ref=e440]: Oracle
              - generic [ref=e441] [cursor=pointer]:
                - generic [ref=e442]: 
                - generic [ref=e443]: SQLite
              - generic [ref=e444] [cursor=pointer]:
                - generic [ref=e445]: 
                - generic [ref=e446]: Debian
              - generic [ref=e447] [cursor=pointer]:
                - generic [ref=e448]: 
                - generic [ref=e449]: Ubuntu
              - generic [ref=e450] [cursor=pointer]:
                - generic [ref=e451]: 
                - generic [ref=e452]: Nginx
              - generic [ref=e453] [cursor=pointer]:
                - generic [ref=e454]: 
                - generic [ref=e455]: Apache
              - generic [ref=e456] [cursor=pointer]:
                - generic [ref=e457]: 
                - generic [ref=e458]: Heroku
              - generic [ref=e459] [cursor=pointer]:
                - generic [ref=e460]: 
                - generic [ref=e461]: DigitalOcean
              - generic [ref=e462] [cursor=pointer]:
                - generic [ref=e463]: 
                - generic [ref=e464]: K8s
    - generic [ref=e465]:
      - generic [ref=e466]:
        - generic [ref=e467]: Credentials
        - heading "Certifications" [level=2] [ref=e468]
      - generic [ref=e469]:
        - generic [ref=e470] [cursor=pointer]:
          - img "Palo Alto Networks Cybersecurity Foundation" [ref=e472]
          - generic [ref=e473]:
            - generic [ref=e474]: Coursera
            - generic [ref=e475]: Palo Alto Networks Cybersecurity Foundation
        - generic [ref=e476] [cursor=pointer]:
          - img "Getting Started with Microsoft Excel" [ref=e478]
          - generic [ref=e479]:
            - generic [ref=e480]: Coursera
            - generic [ref=e481]: Getting Started with Microsoft Excel
        - generic [ref=e482] [cursor=pointer]:
          - img "Google Ads for Beginners" [ref=e484]
          - generic [ref=e485]:
            - generic [ref=e486]: Coursera
            - generic [ref=e487]: Google Ads for Beginners
        - generic [ref=e491] [cursor=pointer]:
          - generic [ref=e492]: Internship Studio
          - generic [ref=e493]: Common Internship Test
        - generic [ref=e497] [cursor=pointer]:
          - generic [ref=e498]: Google
          - generic [ref=e499]: Google Ad Manager
        - generic [ref=e503] [cursor=pointer]:
          - generic [ref=e504]: Google
          - generic [ref=e505]: Google AdMob
        - generic [ref=e509] [cursor=pointer]:
          - generic [ref=e510]: LetsUpgrade
          - generic [ref=e511]: C++ Bootcamp
        - generic [ref=e515] [cursor=pointer]:
          - generic [ref=e516]: LetsUpgrade
          - generic [ref=e517]: HTML & CSS Bootcamp
        - generic [ref=e518] [cursor=pointer]:
          - img "Prompt Engineering for Generative AI" [ref=e520]
          - generic [ref=e521]:
            - generic [ref=e522]: LinkedIn Learning
            - generic [ref=e523]: Introduction to Prompt Engineering for Generative AI
        - generic [ref=e527] [cursor=pointer]:
          - generic [ref=e528]: LetsUpgrade
          - generic [ref=e529]: Social Media Marketing Bootcamp
        - generic [ref=e533] [cursor=pointer]:
          - generic [ref=e534]: LetsUpgrade
          - generic [ref=e535]: Excel Bootcamp
        - generic [ref=e539] [cursor=pointer]:
          - generic [ref=e540]: LetsUpgrade
          - generic [ref=e541]: MongoDB Bootcamp
        - generic [ref=e545] [cursor=pointer]:
          - generic [ref=e546]: LetsUpgrade
          - generic [ref=e547]: DSA with Java Bootcamp
        - generic [ref=e548] [cursor=pointer]:
          - generic [ref=e550]: NVIDIA
          - generic [ref=e551]:
            - generic [ref=e552]: NVIDIA
            - generic [ref=e553]: Getting Started with AI on Jetson Nano
    - generic [ref=e554]:
      - generic [ref=e555]:
        - generic [ref=e556]: My Journey
        - heading "Academic Background" [level=2] [ref=e557]
      - generic [ref=e558]:
        - generic [ref=e561]:
          - heading "B.Tech in Computer Science" [level=3] [ref=e562]
          - generic [ref=e563]: CVR College of Engineering • 2022 - 2026
          - paragraph [ref=e564]: Specializing in Computational Science, Cybersecurity, VLAN networking, and AI models. Campus ambassador and technical hackathon host.
        - generic [ref=e567]:
          - heading "Intermediate/Higher Education" [level=3] [ref=e568]
          - generic [ref=e569]: Sri Chaitanya College of Education • 2020 - 2022
          - paragraph [ref=e570]: Focused on mathematics and physical sciences. Built a strong foundational understanding for advanced computational logic and engineering.
        - generic [ref=e573]:
          - heading "Secondary Education (10th)" [level=3] [ref=e574]
          - generic [ref=e575]: Sri Chaitanya Techno School • Graduated 2020
          - paragraph [ref=e576]: Developed an early passion for technology, problem-solving, and logic-based disciplines.
    - generic [ref=e577]:
      - generic [ref=e578]:
        - generic [ref=e579]: My Work
        - heading "Featured Projects" [level=2] [ref=e580]
      - generic [ref=e581]:
        - article [ref=e582]:
          - generic [ref=e583]:
            - img "VLAN Setup & Simulation" [ref=e584]
            - generic [ref=e585]:
              - generic [ref=e586]: Networking
              - generic [ref=e587]: VLAN
          - generic [ref=e588]:
            - heading "VLAN Network Infrastructure" [level=3] [ref=e589]
            - paragraph [ref=e590]: A secure, simulated virtual LAN layout designing segmented subnetworks for corporate environments to optimize data throughput and reinforce system-wide firewalls.
            - link "" [ref=e592] [cursor=pointer]:
              - /url: https://github.com/viswakpullepu
              - generic [ref=e593]: 
        - article [ref=e594]:
          - generic [ref=e595]:
            - img "Generative AI Prompt Lab" [ref=e596]
            - generic [ref=e597]:
              - generic [ref=e598]: AI / LLM
              - generic [ref=e599]: Prompt Eng
          - generic [ref=e600]:
            - heading "Generative AI Prompt Lab" [level=3] [ref=e601]
            - paragraph [ref=e602]: Interactive experimental playground exploring context window parameters, prompt chains, and system instructions to maximize reasoning and safety in LLMs.
            - link "" [ref=e604] [cursor=pointer]:
              - /url: https://github.com/viswakpullepu
              - generic [ref=e605]: 
        - article [ref=e606]:
          - generic [ref=e607]:
            - img "Computational Model" [ref=e608]
            - generic [ref=e609]:
              - generic [ref=e610]: Computer Science
              - generic [ref=e611]: Algorithms
          - generic [ref=e612]:
            - heading "Computational Science Simulator" [level=3] [ref=e613]
            - paragraph [ref=e614]: Interactive graphical simulation mapping algorithmic problem-solving and thinking strategies to simplify complex data science concepts.
            - link "" [ref=e616] [cursor=pointer]:
              - /url: https://github.com/viswakpullepu
              - generic [ref=e617]: 
    - generic [ref=e618]:
      - generic [ref=e619]:
        - generic [ref=e620]: Open Source
        - heading "GitHub Activity" [level=2] [ref=e621]
      - generic [ref=e622]:
        - heading " Contributions in the last year" [level=3] [ref=e623]:
          - generic [ref=e624]: 
          - text: Contributions in the last year
        - generic [ref=e626]:
          - link "Skip to contributions year list" [ref=e627] [cursor=pointer]:
            - /url: "#year-link-2026"
          - generic [ref=e629]:
            - grid "Contribution Graph" [ref=e631]:
              - caption [ref=e632]: Contribution Graph
              - rowgroup [ref=e633]:
                - row [ref=e634]:
                  - gridcell [ref=e635]
                  - gridcell [ref=e636]:
                    - generic [ref=e637]: Aug
                  - gridcell [ref=e638]:
                    - generic [ref=e639]: Sep
                  - gridcell [ref=e640]:
                    - generic [ref=e641]: Oct
                  - gridcell [ref=e642]:
                    - generic [ref=e643]: Nov
                  - gridcell [ref=e644]:
                    - generic [ref=e645]: Dec
                  - gridcell [ref=e646]:
                    - generic [ref=e647]: Jan
                  - gridcell [ref=e648]:
                    - generic [ref=e649]: Feb
                  - gridcell [ref=e650]:
                    - generic [ref=e651]: Mar
                  - gridcell [ref=e652]:
                    - generic [ref=e653]: Apr
                  - gridcell [ref=e654]:
                    - generic [ref=e655]: May
                  - gridcell [ref=e656]:
                    - generic [ref=e657]: Jun
                  - gridcell [ref=e658]:
                    - generic [ref=e659]: Jul
              - rowgroup [ref=e660]:
                - row [ref=e661]:
                  - gridcell [ref=e662]:
                    - generic [ref=e663]: Sun
                  - gridcell [ref=e664]
                  - gridcell [ref=e665]
                  - gridcell [ref=e666]
                  - gridcell [ref=e667]
                  - gridcell [ref=e668]
                  - gridcell [ref=e669]
                  - gridcell [ref=e670]
                  - gridcell [ref=e671]
                  - gridcell [ref=e672]
                  - gridcell [ref=e673]
                  - gridcell [ref=e674]
                  - gridcell [ref=e675]
                  - gridcell [ref=e676]
                  - gridcell [ref=e677]
                  - gridcell [ref=e678]
                  - gridcell [ref=e679]
                  - gridcell [ref=e680]
                  - gridcell [ref=e681]
                  - gridcell [ref=e682]
                  - gridcell [ref=e683]
                  - gridcell [ref=e684]
                  - gridcell [ref=e685]
                  - gridcell [ref=e686]
                  - gridcell [ref=e687]
                  - gridcell [ref=e688]
                  - gridcell [ref=e689]
                  - gridcell [ref=e690]
                  - gridcell [ref=e691]
                  - gridcell [ref=e692]
                  - gridcell [ref=e693]
                  - gridcell [ref=e694]
                  - gridcell [ref=e695]
                  - gridcell [ref=e696]
                  - gridcell [ref=e697]
                  - gridcell [ref=e698]
                  - gridcell [ref=e699]
                  - gridcell [ref=e700]
                  - gridcell [ref=e701]
                  - gridcell [ref=e702]
                  - gridcell [ref=e703]
                  - gridcell [ref=e704]
                  - gridcell [ref=e705]
                  - gridcell [ref=e706]
                  - gridcell [ref=e707]
                  - gridcell [ref=e708]
                  - gridcell [ref=e709]
                  - gridcell [ref=e710]
                  - gridcell [ref=e711]
                  - gridcell [ref=e712]
                  - gridcell [ref=e713]
                  - gridcell [ref=e714]
                  - gridcell [ref=e715]
                  - gridcell [ref=e716]
                - row [ref=e717]:
                  - gridcell [ref=e718]:
                    - generic [ref=e719]: Mon
                  - gridcell [ref=e720]
                  - gridcell [ref=e721]
                  - gridcell [ref=e722]
                  - gridcell [ref=e723]
                  - gridcell [ref=e724]
                  - gridcell [ref=e725]
                  - gridcell [ref=e726]
                  - gridcell [ref=e727]
                  - gridcell [ref=e728]
                  - gridcell [ref=e729]
                  - gridcell [ref=e730]
                  - gridcell [ref=e731]
                  - gridcell [ref=e732]
                  - gridcell [ref=e733]
                  - gridcell [ref=e734]
                  - gridcell [ref=e735]
                  - gridcell [ref=e736]
                  - gridcell [ref=e737]
                  - gridcell [ref=e738]
                  - gridcell [ref=e739]
                  - gridcell [ref=e740]
                  - gridcell [ref=e741]
                  - gridcell [ref=e742]
                  - gridcell [ref=e743]
                  - gridcell [ref=e744]
                  - gridcell [ref=e745]
                  - gridcell [ref=e746]
                  - gridcell [ref=e747]
                  - gridcell [ref=e748]
                  - gridcell [ref=e749]
                  - gridcell [ref=e750]
                  - gridcell [ref=e751]
                  - gridcell [ref=e752]
                  - gridcell [ref=e753]
                  - gridcell [ref=e754]
                  - gridcell [ref=e755]
                  - gridcell [ref=e756]
                  - gridcell [ref=e757]
                  - gridcell [ref=e758]
                  - gridcell [ref=e759]
                  - gridcell [ref=e760]
                  - gridcell [ref=e761]
                  - gridcell [ref=e762]
                  - gridcell [ref=e763]
                  - gridcell [ref=e764]
                  - gridcell [ref=e765]
                  - gridcell [ref=e766]
                  - gridcell [ref=e767]
                  - gridcell [ref=e768]
                  - gridcell [ref=e769]
                  - gridcell [ref=e770]
                  - gridcell [ref=e771]
                  - gridcell [ref=e772]
                - row [ref=e773]:
                  - gridcell [ref=e774]:
                    - generic [ref=e775]: Tue
                  - gridcell [ref=e776]
                  - gridcell [ref=e777]
                  - gridcell [ref=e778]
                  - gridcell [ref=e779]
                  - gridcell [ref=e780]
                  - gridcell [ref=e781]
                  - gridcell [ref=e782]
                  - gridcell [ref=e783]
                  - gridcell [ref=e784]
                  - gridcell [ref=e785]
                  - gridcell [ref=e786]
                  - gridcell [ref=e787]
                  - gridcell [ref=e788]
                  - gridcell [ref=e789]
                  - gridcell [ref=e790]
                  - gridcell [ref=e791]
                  - gridcell [ref=e792]
                  - gridcell [ref=e793]
                  - gridcell [ref=e794]
                  - gridcell [ref=e795]
                  - gridcell [ref=e796]
                  - gridcell [ref=e797]
                  - gridcell [ref=e798]
                  - gridcell [ref=e799]
                  - gridcell [ref=e800]
                  - gridcell [ref=e801]
                  - gridcell [ref=e802]
                  - gridcell [ref=e803]
                  - gridcell [ref=e804]
                  - gridcell [ref=e805]
                  - gridcell [ref=e806]
                  - gridcell [ref=e807]
                  - gridcell [ref=e808]
                  - gridcell [ref=e809]
                  - gridcell [ref=e810]
                  - gridcell [ref=e811]
                  - gridcell [ref=e812]
                  - gridcell [ref=e813]
                  - gridcell [ref=e814]
                  - gridcell [ref=e815]
                  - gridcell [ref=e816]
                  - gridcell [ref=e817]
                  - gridcell [ref=e818]
                  - gridcell [ref=e819]
                  - gridcell [ref=e820]
                  - gridcell [ref=e821]
                  - gridcell [ref=e822]
                  - gridcell [ref=e823]
                  - gridcell [ref=e824]
                  - gridcell [ref=e825]
                  - gridcell [ref=e826]
                  - gridcell [ref=e827]
                  - gridcell [ref=e828]
                - row [ref=e829]:
                  - gridcell [ref=e830]:
                    - generic [ref=e831]: Wed
                  - gridcell [ref=e832]
                  - gridcell [ref=e833]
                  - gridcell [ref=e834]
                  - gridcell [ref=e835]
                  - gridcell [ref=e836]
                  - gridcell [ref=e837]
                  - gridcell [ref=e838]
                  - gridcell [ref=e839]
                  - gridcell [ref=e840]
                  - gridcell [ref=e841]
                  - gridcell [ref=e842]
                  - gridcell [ref=e843]
                  - gridcell [ref=e844]
                  - gridcell [ref=e845]
                  - gridcell [ref=e846]
                  - gridcell [ref=e847]
                  - gridcell [ref=e848]
                  - gridcell [ref=e849]
                  - gridcell [ref=e850]
                  - gridcell [ref=e851]
                  - gridcell [ref=e852]
                  - gridcell [ref=e853]
                  - gridcell [ref=e854]
                  - gridcell [ref=e855]
                  - gridcell [ref=e856]
                  - gridcell [ref=e857]
                  - gridcell [ref=e858]
                  - gridcell [ref=e859]
                  - gridcell [ref=e860]
                  - gridcell [ref=e861]
                  - gridcell [ref=e862]
                  - gridcell [ref=e863]
                  - gridcell [ref=e864]
                  - gridcell [ref=e865]
                  - gridcell [ref=e866]
                  - gridcell [ref=e867]
                  - gridcell [ref=e868]
                  - gridcell [ref=e869]
                  - gridcell [ref=e870]
                  - gridcell [ref=e871]
                  - gridcell [ref=e872]
                  - gridcell [ref=e873]
                  - gridcell [ref=e874]
                  - gridcell [ref=e875]
                  - gridcell [ref=e876]
                  - gridcell [ref=e877]
                  - gridcell [ref=e878]
                  - gridcell [ref=e879]
                  - gridcell [ref=e880]
                  - gridcell [ref=e881]
                  - gridcell [ref=e882]
                  - gridcell [ref=e883]
                  - gridcell [ref=e884]
                - row [ref=e885]:
                  - gridcell [ref=e886]:
                    - generic [ref=e887]: Thu
                  - gridcell [ref=e888]
                  - gridcell [ref=e889]
                  - gridcell [ref=e890]
                  - gridcell [ref=e891]
                  - gridcell [ref=e892]
                  - gridcell [ref=e893]
                  - gridcell [ref=e894]
                  - gridcell [ref=e895]
                  - gridcell [ref=e896]
                  - gridcell [ref=e897]
                  - gridcell [ref=e898]
                  - gridcell [ref=e899]
                  - gridcell [ref=e900]
                  - gridcell [ref=e901]
                  - gridcell [ref=e902]
                  - gridcell [ref=e903]
                  - gridcell [ref=e904]
                  - gridcell [ref=e905]
                  - gridcell [ref=e906]
                  - gridcell [ref=e907]
                  - gridcell [ref=e908]
                  - gridcell [ref=e909]
                  - gridcell [ref=e910]
                  - gridcell [ref=e911]
                  - gridcell [ref=e912]
                  - gridcell [ref=e913]
                  - gridcell [ref=e914]
                  - gridcell [ref=e915]
                  - gridcell [ref=e916]
                  - gridcell [ref=e917]
                  - gridcell [ref=e918]
                  - gridcell [ref=e919]
                  - gridcell [ref=e920]
                  - gridcell [ref=e921]
                  - gridcell [ref=e922]
                  - gridcell [ref=e923]
                  - gridcell [ref=e924]
                  - gridcell [ref=e925]
                  - gridcell [ref=e926]
                  - gridcell [ref=e927]
                  - gridcell [ref=e928]
                  - gridcell [ref=e929]
                  - gridcell [ref=e930]
                  - gridcell [ref=e931]
                  - gridcell [ref=e932]
                  - gridcell [ref=e933]
                  - gridcell [ref=e934]
                  - gridcell [ref=e935]
                  - gridcell [ref=e936]
                  - gridcell [ref=e937]
                  - gridcell [ref=e938]
                  - gridcell [ref=e939]
                  - gridcell [ref=e940]
                - row [ref=e941]:
                  - gridcell [ref=e942]:
                    - generic [ref=e943]: Fri
                  - gridcell [ref=e944]
                  - gridcell [ref=e945]
                  - gridcell [ref=e946]
                  - gridcell [ref=e947]
                  - gridcell [ref=e948]
                  - gridcell [ref=e949]
                  - gridcell [ref=e950]
                  - gridcell [ref=e951]
                  - gridcell [ref=e952]
                  - gridcell [ref=e953]
                  - gridcell [ref=e954]
                  - gridcell [ref=e955]
                  - gridcell [ref=e956]
                  - gridcell [ref=e957]
                  - gridcell [ref=e958]
                  - gridcell [ref=e959]
                  - gridcell [ref=e960]
                  - gridcell [ref=e961]
                  - gridcell [ref=e962]
                  - gridcell [ref=e963]
                  - gridcell [ref=e964]
                  - gridcell [ref=e965]
                  - gridcell [ref=e966]
                  - gridcell [ref=e967]
                  - gridcell [ref=e968]
                  - gridcell [ref=e969]
                  - gridcell [ref=e970]
                  - gridcell [ref=e971]
                  - gridcell [ref=e972]
                  - gridcell [ref=e973]
                  - gridcell [ref=e974]
                  - gridcell [ref=e975]
                  - gridcell [ref=e976]
                  - gridcell [ref=e977]
                  - gridcell [ref=e978]
                  - gridcell [ref=e979]
                  - gridcell [ref=e980]
                  - gridcell [ref=e981]
                  - gridcell [ref=e982]
                  - gridcell [ref=e983]
                  - gridcell [ref=e984]
                  - gridcell [ref=e985]
                  - gridcell [ref=e986]
                  - gridcell [ref=e987]
                  - gridcell [ref=e988]
                  - gridcell [ref=e989]
                  - gridcell [ref=e990]
                  - gridcell [ref=e991]
                  - gridcell [ref=e992]
                  - gridcell [ref=e993]
                  - gridcell [ref=e994]
                  - gridcell [ref=e995]
                  - gridcell [ref=e996]
                - row [ref=e997]:
                  - gridcell [ref=e998]:
                    - generic [ref=e999]: Sat
                  - gridcell [ref=e1000]
                  - gridcell [ref=e1001]
                  - gridcell [ref=e1002]
                  - gridcell [ref=e1003]
                  - gridcell [ref=e1004]
                  - gridcell [ref=e1005]
                  - gridcell [ref=e1006]
                  - gridcell [ref=e1007]
                  - gridcell [ref=e1008]
                  - gridcell [ref=e1009]
                  - gridcell [ref=e1010]
                  - gridcell [ref=e1011]
                  - gridcell [ref=e1012]
                  - gridcell [ref=e1013]
                  - gridcell [ref=e1014]
                  - gridcell [ref=e1015]
                  - gridcell [ref=e1016]
                  - gridcell [ref=e1017]
                  - gridcell [ref=e1018]
                  - gridcell [ref=e1019]
                  - gridcell [ref=e1020]
                  - gridcell [ref=e1021]
                  - gridcell [ref=e1022]
                  - gridcell [ref=e1023]
                  - gridcell [ref=e1024]
                  - gridcell [ref=e1025]
                  - gridcell [ref=e1026]
                  - gridcell [ref=e1027]
                  - gridcell [ref=e1028]
                  - gridcell [ref=e1029]
                  - gridcell [ref=e1030]
                  - gridcell [ref=e1031]
                  - gridcell [ref=e1032]
                  - gridcell [ref=e1033]
                  - gridcell [ref=e1034]
                  - gridcell [ref=e1035]
                  - gridcell [ref=e1036]
                  - gridcell [ref=e1037]
                  - gridcell [ref=e1038]
                  - gridcell [ref=e1039]
                  - gridcell [ref=e1040]
                  - gridcell [ref=e1041]
                  - gridcell [ref=e1042]
                  - gridcell [ref=e1043]
                  - gridcell [ref=e1044]
                  - gridcell [ref=e1045]
                  - gridcell [ref=e1046]
                  - gridcell [ref=e1047]
                  - gridcell [ref=e1048]
                  - gridcell [ref=e1049]
                  - gridcell [ref=e1050]
                  - gridcell [ref=e1051]
                  - gridcell [ref=e1052]
            - generic [ref=e1053]:
              - text: Less
              - text: More
      - paragraph [ref=e1060]: Unable to load GitHub repositories at the moment. (API Rate Limit)
      - link "View Full Profile " [ref=e1062] [cursor=pointer]:
        - /url: https://github.com/viswakpullepu
        - text: View Full Profile
        - generic [ref=e1063]: 
    - generic [ref=e1064]:
      - generic [ref=e1065]:
        - generic [ref=e1066]: Live Apps
        - heading "Vercel Deployments" [level=2] [ref=e1067]:
          - img [ref=e1068]
          - text: Vercel Deployments
        - paragraph [ref=e1070]: Automatically tracking live production deployments mapped from my GitHub repositories.
      - text: 
      - generic [ref=e1071]:
        - link "Activity Generator Manual Review A sleek digital utility for generating and tracking custom activities and workflows. activity-generator.vercel.app Review " [ref=e1072] [cursor=pointer]:
          - /url: https://activity-generator.vercel.app
          - generic [ref=e1073]:
            - generic [ref=e1074]:
              - heading "Activity Generator" [level=3] [ref=e1075]:
                - img [ref=e1076]
                - text: Activity Generator
              - generic [ref=e1078]: Manual Review
            - paragraph [ref=e1080]: A sleek digital utility for generating and tracking custom activities and workflows.
          - generic [ref=e1081]:
            - generic [ref=e1082]: activity-generator.vercel.app
            - button "Review " [ref=e1083]:
              - text: Review
              - generic [ref=e1084]: 
        - link "Anon Chat Manual Review A real-time anonymous messaging platform built for secure and untraceable communication. anon-chat.vercel.app Review " [ref=e1085] [cursor=pointer]:
          - /url: https://anon-chat.vercel.app
          - generic [ref=e1086]:
            - generic [ref=e1087]:
              - heading "Anon Chat" [level=3] [ref=e1088]:
                - img [ref=e1089]
                - text: Anon Chat
              - generic [ref=e1091]: Manual Review
            - paragraph [ref=e1093]: A real-time anonymous messaging platform built for secure and untraceable communication.
          - generic [ref=e1094]:
            - generic [ref=e1095]: anon-chat.vercel.app
            - button "Review " [ref=e1096]:
              - text: Review
              - generic [ref=e1097]: 
        - link "Canarytoken Manual Review A digital trap and tracking system designed to alert you of unauthorized system access. canarytoken.vercel.app Review " [ref=e1098] [cursor=pointer]:
          - /url: https://canarytoken.vercel.app
          - generic [ref=e1099]:
            - generic [ref=e1100]:
              - heading "Canarytoken" [level=3] [ref=e1101]:
                - img [ref=e1102]
                - text: Canarytoken
              - generic [ref=e1104]: Manual Review
            - paragraph [ref=e1106]: A digital trap and tracking system designed to alert you of unauthorized system access.
          - generic [ref=e1107]:
            - generic [ref=e1108]: canarytoken.vercel.app
            - button "Review " [ref=e1109]:
              - text: Review
              - generic [ref=e1110]: 
        - link "Cvresportsoff Manual Review An export and management utility for CV and esports related tracking systems. cvresportsoff.vercel.app Review " [ref=e1111] [cursor=pointer]:
          - /url: https://cvresportsoff.vercel.app
          - generic [ref=e1112]:
            - generic [ref=e1113]:
              - heading "Cvresportsoff" [level=3] [ref=e1114]:
                - img [ref=e1115]
                - text: Cvresportsoff
              - generic [ref=e1117]: Manual Review
            - paragraph [ref=e1119]: An export and management utility for CV and esports related tracking systems.
          - generic [ref=e1120]:
            - generic [ref=e1121]: cvresportsoff.vercel.app
            - button "Review " [ref=e1122]:
              - text: Review
              - generic [ref=e1123]: 
        - link "Demo Restaurant Backend Manual Review Robust server-side architecture and database management for a modern restaurant application. demo-restaurant-backend.vercel.app Review " [ref=e1124] [cursor=pointer]:
          - /url: https://demo-restaurant-backend.vercel.app
          - generic [ref=e1125]:
            - generic [ref=e1126]:
              - heading "Demo Restaurant Backend" [level=3] [ref=e1127]:
                - img [ref=e1128]
                - text: Demo Restaurant Backend
              - generic [ref=e1130]: Manual Review
            - paragraph [ref=e1132]: Robust server-side architecture and database management for a modern restaurant application.
          - generic [ref=e1133]:
            - generic [ref=e1134]: demo-restaurant-backend.vercel.app
            - button "Review " [ref=e1135]:
              - text: Review
              - generic [ref=e1136]: 
        - link "Demo Restaurant Frontend Manual Review An elegant, responsive customer-facing interface for a restaurant ordering system. demo-restaurant-frontend.vercel.app Review " [ref=e1137] [cursor=pointer]:
          - /url: https://demo-restaurant-frontend.vercel.app
          - generic [ref=e1138]:
            - generic [ref=e1139]:
              - heading "Demo Restaurant Frontend" [level=3] [ref=e1140]:
                - img [ref=e1141]
                - text: Demo Restaurant Frontend
              - generic [ref=e1143]: Manual Review
            - paragraph [ref=e1145]: An elegant, responsive customer-facing interface for a restaurant ordering system.
          - generic [ref=e1146]:
            - generic [ref=e1147]: demo-restaurant-frontend.vercel.app
            - button "Review " [ref=e1148]:
              - text: Review
              - generic [ref=e1149]: 
        - link "Interior Design Manual Review A visually stunning landing page for premium interior design and architectural services. interior-design.vercel.app Review " [ref=e1150] [cursor=pointer]:
          - /url: https://interior-design.vercel.app
          - generic [ref=e1151]:
            - generic [ref=e1152]:
              - heading "Interior Design" [level=3] [ref=e1153]:
                - img [ref=e1154]
                - text: Interior Design
              - generic [ref=e1156]: Manual Review
            - paragraph [ref=e1158]: A visually stunning landing page for premium interior design and architectural services.
          - generic [ref=e1159]:
            - generic [ref=e1160]: interior-design.vercel.app
            - button "Review " [ref=e1161]:
              - text: Review
              - generic [ref=e1162]: 
        - link "Kotha S Atelier Manual Review A sophisticated web application tailored for an atelier, focusing on premium digital presentation. kothas-atelier.vercel.app Review " [ref=e1163] [cursor=pointer]:
          - /url: https://kothas-atelier.vercel.app
          - generic [ref=e1164]:
            - generic [ref=e1165]:
              - heading "Kotha S Atelier" [level=3] [ref=e1166]:
                - img [ref=e1167]
                - text: Kotha S Atelier
              - generic [ref=e1169]: Manual Review
            - paragraph [ref=e1171]: A sophisticated web application tailored for an atelier, focusing on premium digital presentation.
          - generic [ref=e1172]:
            - generic [ref=e1173]: kothas-atelier.vercel.app
            - button "Review " [ref=e1174]:
              - text: Review
              - generic [ref=e1175]: 
        - link "LORVEN Manual Review Corporate portfolio and service showcase for a comprehensive digital services company. lorven.vercel.app Review " [ref=e1176] [cursor=pointer]:
          - /url: https://lorven.vercel.app
          - generic [ref=e1177]:
            - generic [ref=e1178]:
              - heading "LORVEN" [level=3] [ref=e1179]:
                - img [ref=e1180]
                - text: LORVEN
              - generic [ref=e1182]: Manual Review
            - paragraph [ref=e1184]: Corporate portfolio and service showcase for a comprehensive digital services company.
          - generic [ref=e1185]:
            - generic [ref=e1186]: lorven.vercel.app
            - button "Review " [ref=e1187]:
              - text: Review
              - generic [ref=e1188]: 
        - link "Ngl Clone Manual Review A functional frontend clone of the popular NGL anonymous Q&A platform. ngl-clone.vercel.app Review " [ref=e1189] [cursor=pointer]:
          - /url: https://ngl-clone.vercel.app
          - generic [ref=e1190]:
            - generic [ref=e1191]:
              - heading "Ngl Clone" [level=3] [ref=e1192]:
                - img [ref=e1193]
                - text: Ngl Clone
              - generic [ref=e1195]: Manual Review
            - paragraph [ref=e1197]: A functional frontend clone of the popular NGL anonymous Q&A platform.
          - generic [ref=e1198]:
            - generic [ref=e1199]: ngl-clone.vercel.app
            - button "Review " [ref=e1200]:
              - text: Review
              - generic [ref=e1201]: 
        - link "Password Strength Checker Manual Review A Python-based cryptographic tool for evaluating and validating password entropy. password-strength-checker.vercel.app Review " [ref=e1202] [cursor=pointer]:
          - /url: https://password-strength-checker.vercel.app
          - generic [ref=e1203]:
            - generic [ref=e1204]:
              - heading "Password Strength Checker" [level=3] [ref=e1205]:
                - img [ref=e1206]
                - text: Password Strength Checker
              - generic [ref=e1208]: Manual Review
            - paragraph [ref=e1210]: A Python-based cryptographic tool for evaluating and validating password entropy.
          - generic [ref=e1211]:
            - generic [ref=e1212]: password-strength-checker.vercel.app
            - button "Review " [ref=e1213]:
              - text: Review
              - generic [ref=e1214]: 
        - link "Ppt Reviewer Agent Manual Review An AI-powered analyzer built with FastAPI that reviews presentations and provides actionable design suggestions. ppt-reviewer-agent.vercel.app Review " [ref=e1215] [cursor=pointer]:
          - /url: https://ppt-reviewer-agent.vercel.app
          - generic [ref=e1216]:
            - generic [ref=e1217]:
              - heading "Ppt Reviewer Agent" [level=3] [ref=e1218]:
                - img [ref=e1219]
                - text: Ppt Reviewer Agent
              - generic [ref=e1221]: Manual Review
            - paragraph [ref=e1223]: An AI-powered analyzer built with FastAPI that reviews presentations and provides actionable design suggestions.
          - generic [ref=e1224]:
            - generic [ref=e1225]: ppt-reviewer-agent.vercel.app
            - button "Review " [ref=e1226]:
              - text: Review
              - generic [ref=e1227]: 
        - link "Professional Resume Manual Review A cleanly formatted, code-based professional resume repository. professional-resume.vercel.app Review " [ref=e1228] [cursor=pointer]:
          - /url: https://professional-resume.vercel.app
          - generic [ref=e1229]:
            - generic [ref=e1230]:
              - heading "Professional Resume" [level=3] [ref=e1231]:
                - img [ref=e1232]
                - text: Professional Resume
              - generic [ref=e1234]: Manual Review
            - paragraph [ref=e1236]: A cleanly formatted, code-based professional resume repository.
          - generic [ref=e1237]:
            - generic [ref=e1238]: professional-resume.vercel.app
            - button "Review " [ref=e1239]:
              - text: Review
              - generic [ref=e1240]: 
        - link "Resume Builder App Manual Review A full-stack resume maker with AI-powered suggestions and ATS optimization. resume-builder-app.vercel.app Review " [ref=e1241] [cursor=pointer]:
          - /url: https://resume-builder-app.vercel.app
          - generic [ref=e1242]:
            - generic [ref=e1243]:
              - heading "Resume Builder App" [level=3] [ref=e1244]:
                - img [ref=e1245]
                - text: Resume Builder App
              - generic [ref=e1247]: Manual Review
            - paragraph [ref=e1249]: A full-stack resume maker with AI-powered suggestions and ATS optimization.
          - generic [ref=e1250]:
            - generic [ref=e1251]: resume-builder-app.vercel.app
            - button "Review " [ref=e1252]:
              - text: Review
              - generic [ref=e1253]: 
        - link "Resume Maker Manual Review A lightweight client-side application for generating and downloading PDF resumes in real-time. resume-maker.vercel.app Review " [ref=e1254] [cursor=pointer]:
          - /url: https://resume-maker.vercel.app
          - generic [ref=e1255]:
            - generic [ref=e1256]:
              - heading "Resume Maker" [level=3] [ref=e1257]:
                - img [ref=e1258]
                - text: Resume Maker
              - generic [ref=e1260]: Manual Review
            - paragraph [ref=e1262]: A lightweight client-side application for generating and downloading PDF resumes in real-time.
          - generic [ref=e1263]:
            - generic [ref=e1264]: resume-maker.vercel.app
            - button "Review " [ref=e1265]:
              - text: Review
              - generic [ref=e1266]: 
        - link "REVISO Manual Review A sleek pre-registration portal featuring modern UI components and conversion optimization. reviso.vercel.app Review " [ref=e1267] [cursor=pointer]:
          - /url: https://reviso.vercel.app
          - generic [ref=e1268]:
            - generic [ref=e1269]:
              - heading "REVISO" [level=3] [ref=e1270]:
                - img [ref=e1271]
                - text: REVISO
              - generic [ref=e1273]: Manual Review
            - paragraph [ref=e1275]: A sleek pre-registration portal featuring modern UI components and conversion optimization.
          - generic [ref=e1276]:
            - generic [ref=e1277]: reviso.vercel.app
            - button "Review " [ref=e1278]:
              - text: Review
              - generic [ref=e1279]: 
        - link "Vishwak Naidu Manual Review My primary creative developer portfolio, featuring glassmorphism and advanced GSAP animations. vishwak-naidu.vercel.app Review " [ref=e1280] [cursor=pointer]:
          - /url: https://vishwak-naidu.vercel.app
          - generic [ref=e1281]:
            - generic [ref=e1282]:
              - heading "Vishwak Naidu" [level=3] [ref=e1283]:
                - img [ref=e1284]
                - text: Vishwak Naidu
              - generic [ref=e1286]: Manual Review
            - paragraph [ref=e1288]: My primary creative developer portfolio, featuring glassmorphism and advanced GSAP animations.
          - generic [ref=e1289]:
            - generic [ref=e1290]: vishwak-naidu.vercel.app
            - button "Review " [ref=e1291]:
              - text: Review
              - generic [ref=e1292]: 
        - link "Viswak Portfolio Manual Review An alternative, streamlined version of my professional web development portfolio. viswak-portfolio.vercel.app Review " [ref=e1293] [cursor=pointer]:
          - /url: https://viswak-portfolio.vercel.app
          - generic [ref=e1294]:
            - generic [ref=e1295]:
              - heading "Viswak Portfolio" [level=3] [ref=e1296]:
                - img [ref=e1297]
                - text: Viswak Portfolio
              - generic [ref=e1299]: Manual Review
            - paragraph [ref=e1301]: An alternative, streamlined version of my professional web development portfolio.
          - generic [ref=e1302]:
            - generic [ref=e1303]: viswak-portfolio.vercel.app
            - button "Review " [ref=e1304]:
              - text: Review
              - generic [ref=e1305]: 
        - link "Viswakpullepu Manual Review The foundational README repository that acts as the front page of my GitHub profile. viswakpullepu.vercel.app Review " [ref=e1306] [cursor=pointer]:
          - /url: https://viswakpullepu.vercel.app
          - generic [ref=e1307]:
            - generic [ref=e1308]:
              - heading "Viswakpullepu" [level=3] [ref=e1309]:
                - img [ref=e1310]
                - text: Viswakpullepu
              - generic [ref=e1312]: Manual Review
            - paragraph [ref=e1314]: The foundational README repository that acts as the front page of my GitHub profile.
          - generic [ref=e1315]:
            - generic [ref=e1316]: viswakpullepu.vercel.app
            - button "Review " [ref=e1317]:
              - text: Review
              - generic [ref=e1318]: 
        - link "Vn Music Assistant Manual Review A digital music utility designed to assist with audio playback and frequency analysis. vn-music-assistant.vercel.app Review " [ref=e1319] [cursor=pointer]:
          - /url: https://vn-music-assistant.vercel.app
          - generic [ref=e1320]:
            - generic [ref=e1321]:
              - heading "Vn Music Assistant" [level=3] [ref=e1322]:
                - img [ref=e1323]
                - text: Vn Music Assistant
              - generic [ref=e1325]: Manual Review
            - paragraph [ref=e1327]: A digital music utility designed to assist with audio playback and frequency analysis.
          - generic [ref=e1328]:
            - generic [ref=e1329]: vn-music-assistant.vercel.app
            - button "Review " [ref=e1330]:
              - text: Review
              - generic [ref=e1331]: 
    - generic [ref=e1332]:
      - generic [ref=e1333]:
        - generic [ref=e1334]: Beyond Code
        - heading "Career Highlights & Initiatives" [level=2] [ref=e1335]
      - generic [ref=e1336]:
        - generic [ref=e1337] [cursor=pointer]:
          - generic [ref=e1339]: 
          - heading "Generative AI Integration" [level=3] [ref=e1340]
          - paragraph [ref=e1341]: As CTO at Lorven Enterprises, I spearheaded the integration of advanced Generative AI and prompt engineering techniques into modern web platforms to dramatically enhance interactive user experiences.
        - generic [ref=e1342] [cursor=pointer]:
          - generic [ref=e1344]: 
          - heading "Hackathon Hosting & Leadership" [level=3] [ref=e1345]
          - paragraph [ref=e1346]: Successfully managed and hosted highly competitive technical hackathons and events, fostering student engagement, collaborative problem solving, and innovation within the campus tech community.
        - generic [ref=e1347] [cursor=pointer]:
          - generic [ref=e1349]: 
          - heading "Cybersecurity Focus" [level=3] [ref=e1350]
          - paragraph [ref=e1351]: Applied rigorous expertise in Firewalls, VLANs, and Network Traffic Analysis to study robust security systems, backed by foundational certifications from Palo Alto Networks.
    - generic [ref=e1352]:
      - generic [ref=e1353]:
        - generic [ref=e1354]: Get In Touch
        - heading "Contact Me" [level=2] [ref=e1355]
      - generic [ref=e1356]:
        - generic [ref=e1357]:
          - heading "Send a Message" [level=3] [ref=e1358]
          - generic [ref=e1359]:
            - generic [ref=e1360]:
              - generic [ref=e1361]:
                - generic [ref=e1362]: Your Name
                - textbox "Your Name" [ref=e1363]
              - generic [ref=e1364]:
                - generic [ref=e1365]: Your Email
                - textbox "Your Email" [ref=e1366]
            - generic [ref=e1367]:
              - generic [ref=e1368]: Your Phone Number
              - textbox "Your Phone Number" [ref=e1369]:
                - /placeholder: e.g. +1 234 567 8900
            - generic [ref=e1370]:
              - generic [ref=e1371]: Your Message
              - textbox "Your Message" [ref=e1372]
            - button "Send Message " [ref=e1373] [cursor=pointer]:
              - generic [ref=e1374]: Send Message
              - generic [ref=e1375]: 
        - generic [ref=e1376]:
          - generic [ref=e1377]:
            - heading "Contact Info" [level=3] [ref=e1378]
            - generic [ref=e1379]:
              - generic [ref=e1381]: 
              - generic [ref=e1382]:
                - generic [ref=e1383]: Call Me
                - generic [ref=e1384]: +91 9848990042
            - generic [ref=e1385]:
              - generic [ref=e1387]: 
              - generic [ref=e1388]:
                - generic [ref=e1389]: Email Me
                - link "viswakpullepu1@gmail.com" [ref=e1391] [cursor=pointer]:
                  - /url: mailto:viswakpullepu1@gmail.com
            - generic [ref=e1392]:
              - generic [ref=e1394]: 
              - generic [ref=e1395]:
                - generic [ref=e1396]: Location
                - generic [ref=e1397]: Hyderabad, Telangana, India
          - generic [ref=e1398]:
            - generic [ref=e1399]: Social Links
            - generic [ref=e1400]:
              - link "" [ref=e1401] [cursor=pointer]:
                - /url: https://github.com/viswakpullepu
                - generic [ref=e1402]: 
              - link "" [ref=e1403] [cursor=pointer]:
                - /url: https://www.instagram.com/vishwak_pullepu/
                - generic [ref=e1404]: 
              - link "" [ref=e1405] [cursor=pointer]:
                - /url: https://www.linkedin.com/in/vishwakpullepu/
                - generic [ref=e1406]: 
            - link "Download Resume " [ref=e1408] [cursor=pointer]:
              - /url: assets/1749357767653.pdf
              - generic [ref=e1409]: Download Resume
              - generic [ref=e1410]: 
          - generic [ref=e1411]:
            - heading "Current Availability" [level=4] [ref=e1413]
            - paragraph [ref=e1414]: Open for research collaborations, computational projects, and networking opportunities at CVR College of Engineering.
    - generic [ref=e1415]:
      - generic [ref=e1416]:
        - link "GitHub" [ref=e1417] [cursor=pointer]:
          - /url: https://github.com/viswakpullepu
          - generic [ref=e1418]: 
        - link "Instagram" [ref=e1419] [cursor=pointer]:
          - /url: https://www.instagram.com/vishwak_pullepu/
          - generic [ref=e1420]: 
        - link "LinkedIn" [ref=e1421] [cursor=pointer]:
          - /url: https://www.linkedin.com/in/vishwakpullepu/
          - generic [ref=e1422]: 
      - paragraph [ref=e1423]: © 2026 Vishwak Pullepu. All rights reserved. Designed with passion.
      - link "Established online - Public launch record" [ref=e1425] [cursor=pointer]:
        - /url: https://websitelaunches.com/site/vishwak.tech
        - img "Established online - Public launch record" [ref=e1426]
  - generic [ref=e1428]:
    - generic [ref=e1429]: 
    - heading "Message Sent!" [level=2] [ref=e1430]
```

# Test source

```ts
  15  |     const header = page.locator('header');
  16  |     const drawer = page.locator('.mobile-nav-menu');
  17  |     const toggleBtn = page.locator('.mobile-nav-toggle');
  18  | 
  19  |     // 1. Verify computed z-indexes
  20  |     const headerZIndex = await header.evaluate(el => window.getComputedStyle(el).zIndex);
  21  |     const drawerZIndex = await drawer.evaluate(el => window.getComputedStyle(el).zIndex);
  22  | 
  23  |     expect(headerZIndex).toBe('1000');
  24  |     expect(drawerZIndex).toBe('1005');
  25  |     expect(parseInt(drawerZIndex, 10)).toBeGreaterThan(parseInt(headerZIndex, 10));
  26  | 
  27  |     // 2. Open mobile drawer menu
  28  |     await toggleBtn.click();
  29  |     await expect(drawer).toHaveClass(/open/);
  30  | 
  31  |     // Wait 650ms for CSS sliding transition (0.6s cubic-bezier) to complete
  32  |     await page.waitForTimeout(650);
  33  | 
  34  |     // 3. Verify element at top-right (where close button sits, overlapping header area)
  35  |     const elementAtPoint = await page.evaluate(() => {
  36  |       const el = document.elementFromPoint(window.innerWidth - 30, 30);
  37  |       return {
  38  |         tagName: el ? el.tagName : null,
  39  |         className: el ? el.className : null,
  40  |         closestDrawer: el ? el.closest('.mobile-nav-menu') !== null : false
  41  |       };
  42  |     });
  43  | 
  44  |     expect(elementAtPoint.closestDrawer).toBe(true);
  45  |   });
  46  | 
  47  |   test('Scenario 2: Landscape mobile viewport scrolling in mobile nav drawer (max-height: 100vh; overflow-y: auto)', async ({ page }) => {
  48  |     // Set landscape mobile viewport (low height, wide width)
  49  |     await page.setViewportSize({ width: 667, height: 375 });
  50  |     await page.goto('/');
  51  | 
  52  |     await page.waitForSelector('main:not(.hidden)', { timeout: 15000 });
  53  | 
  54  |     const drawer = page.locator('.mobile-nav-menu');
  55  |     const toggleBtn = page.locator('.mobile-nav-toggle');
  56  | 
  57  |     // Open mobile drawer
  58  |     await toggleBtn.click();
  59  |     await expect(drawer).toHaveClass(/open/);
  60  |     await page.waitForTimeout(650);
  61  | 
  62  |     // Get computed overflow-y and max-height
  63  |     const drawerStyles = await drawer.evaluate(el => {
  64  |       const style = window.getComputedStyle(el);
  65  |       return {
  66  |         maxHeight: style.maxHeight,
  67  |         overflowY: style.overflowY,
  68  |         clientHeight: el.clientHeight,
  69  |         scrollHeight: el.scrollHeight
  70  |       };
  71  |     });
  72  | 
  73  |     expect(drawerStyles.overflowY).toBe('auto');
  74  |     expect(drawerStyles.scrollHeight).toBeGreaterThan(drawerStyles.clientHeight);
  75  | 
  76  |     // Test scroll to bottom of drawer
  77  |     const initialScrollTop = await drawer.evaluate(el => el.scrollTop);
  78  |     expect(initialScrollTop).toBe(0);
  79  | 
  80  |     // Perform scroll inside drawer
  81  |     await drawer.evaluate(el => { el.scrollTop = el.scrollHeight; });
  82  |     const newScrollTop = await drawer.evaluate(el => el.scrollTop);
  83  |     expect(newScrollTop).toBeGreaterThan(0);
  84  | 
  85  |     // Check bottom contact link visibility
  86  |     const contactLink = drawer.locator('a[href="#contact"]');
  87  |     await expect(contactLink).toBeVisible();
  88  |   });
  89  | 
  90  |   test('Scenario 3: Nav scrollspy active highlighting on mobile viewports (Lenis decoupled)', async ({ page }) => {
  91  |     await page.setViewportSize({ width: 375, height: 667 });
  92  |     await page.goto('/');
  93  | 
  94  |     await page.waitForSelector('main:not(.hidden)', { timeout: 15000 });
  95  |     await page.waitForTimeout(500);
  96  | 
  97  |     // Verify lenis is null on mobile
  98  |     const lenisStatus = await page.evaluate(() => window.lenis === null || typeof window.lenis === 'undefined' || window.innerWidth <= 768);
  99  |     expect(lenisStatus).toBe(true);
  100 | 
  101 |     // Scroll to #skills section
  102 |     await page.evaluate(() => {
  103 |       const el = document.querySelector('#skills');
  104 |       if (el) window.scrollTo(0, el.offsetTop + 50);
  105 |     });
  106 | 
  107 |     await page.waitForTimeout(400);
  108 | 
  109 |     // Check active nav link
  110 |     const activeLinkHref = await page.evaluate(() => {
  111 |       const active = document.querySelector('nav a.active, .mobile-nav-menu a.active');
  112 |       return active ? active.getAttribute('href') : null;
  113 |     });
  114 | 
> 115 |     expect(activeLinkHref).toBe('#skills');
      |                            ^ Error: expect(received).toBe(expected) // Object.is equality
  116 | 
  117 |     // Scroll to #certifications section
  118 |     await page.evaluate(() => {
  119 |       const el = document.querySelector('#certifications');
  120 |       if (el) window.scrollTo(0, el.offsetTop + 50);
  121 |     });
  122 | 
  123 |     await page.waitForTimeout(400);
  124 | 
  125 |     const certActiveHref = await page.evaluate(() => {
  126 |       const active = document.querySelector('nav a.active, .mobile-nav-menu a.active');
  127 |       return active ? active.getAttribute('href') : null;
  128 |     });
  129 | 
  130 |     expect(certActiveHref).toBe('#certifications');
  131 |   });
  132 | 
  133 |   test('Scenario 4: Form validation .error class input borders and dynamic error text styling', async ({ page }) => {
  134 |     await page.goto('/');
  135 |     await page.waitForSelector('main:not(.hidden)', { timeout: 15000 });
  136 | 
  137 |     const submitBtn = page.locator('#portfolio-contact-form .submit-btn');
  138 |     const nameInput = page.locator('#form-name');
  139 |     const emailInput = page.locator('#form-email');
  140 |     const phoneInput = page.locator('#form-phone');
  141 |     const messageInput = page.locator('#form-message');
  142 | 
  143 |     // 1. Submit empty form
  144 |     await submitBtn.click();
  145 | 
  146 |     // Check error classes on name & message groups
  147 |     const nameGroup = nameInput.locator('xpath=..');
  148 |     const messageGroup = messageInput.locator('xpath=..');
  149 | 
  150 |     await expect(nameGroup).toHaveClass(/error/);
  151 |     await expect(messageGroup).toHaveClass(/error/);
  152 | 
  153 |     // Wait 450ms for CSS border-color transition to complete
  154 |     await page.waitForTimeout(450);
  155 | 
  156 |     // Check computed border color of error input (#ef4444)
  157 |     const nameBorderColor = await nameInput.evaluate(el => window.getComputedStyle(el).borderColor);
  158 |     expect(nameBorderColor).toMatch(/rgba?\(23[89],\s*6[89]|ef4444/i);
  159 | 
  160 |     // Check button state
  161 |     await expect(submitBtn).toHaveText(/Fields Required!/);
  162 | 
  163 |     // Wait for error timeout reset
  164 |     await page.waitForTimeout(3500);
  165 |     await expect(nameGroup).not.toHaveClass(/error/);
  166 | 
  167 |     // 2. Submit invalid email
  168 |     await nameInput.fill('Vishwak');
  169 |     await messageInput.fill('Hello testing error states');
  170 |     await emailInput.fill('invalid-email');
  171 |     await phoneInput.fill('+91 9848990042');
  172 | 
  173 |     await submitBtn.click();
  174 | 
  175 |     const emailGroup = emailInput.locator('xpath=..');
  176 |     await expect(emailGroup).toHaveClass(/error/);
  177 |     await page.waitForTimeout(450);
  178 | 
  179 |     const emailBorderColor = await emailInput.evaluate(el => window.getComputedStyle(el).borderColor);
  180 |     expect(emailBorderColor).toMatch(/rgba?\(23[89],\s*6[89]|ef4444/i);
  181 |     await expect(submitBtn).toHaveText(/Invalid Email!/);
  182 | 
  183 |     // Wait for error timeout reset
  184 |     await page.waitForTimeout(3500);
  185 |     await expect(emailGroup).not.toHaveClass(/error/);
  186 | 
  187 |     // 3. Submit invalid phone
  188 |     await emailInput.fill('test@example.com');
  189 |     await phoneInput.fill('123'); // Phone too short (< 7 chars)
  190 | 
  191 |     await submitBtn.click();
  192 | 
  193 |     const phoneGroup = phoneInput.locator('xpath=..');
  194 |     await expect(phoneGroup).toHaveClass(/error/);
  195 |     await page.waitForTimeout(450);
  196 | 
  197 |     const phoneBorderColor = await phoneInput.evaluate(el => window.getComputedStyle(el).borderColor);
  198 |     expect(phoneBorderColor).toMatch(/rgba?\(23[89],\s*6[89]|ef4444/i);
  199 |     await expect(submitBtn).toHaveText(/Invalid Phone!/);
  200 |   });
  201 | 
  202 |   test('Scenario 5: GSAP tilt vs CSS hover fanning on award cards', async ({ page }) => {
  203 |     await page.setViewportSize({ width: 1280, height: 800 });
  204 |     await page.goto('/');
  205 |     await page.waitForSelector('main:not(.hidden)', { timeout: 15000 });
  206 | 
  207 |     const awardCard = page.locator('#certifications .award-card').last(); // Use last award card to avoid overlap from subsequent cards
  208 |     const nonAwardCard = page.locator('.project-card').first();
  209 | 
  210 |     // 1. Move mouse over non-award card (e.g. project card)
  211 |     await nonAwardCard.hover();
  212 |     await page.mouse.move(100, 100);
  213 |     await page.waitForTimeout(300);
  214 | 
  215 |     // 2. Move mouse over last award card
```