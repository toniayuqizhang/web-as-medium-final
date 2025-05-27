const articles = [
    { title: "Where hoarding happens...", content: "Digital hoarding occurs in any electronic spaces where information is stored. These are common areas where digital clutter may exist: Browser tabs, Excessive desktop icons, Digital images, Old documents, File folders, Email inboxes, Internet bookmarks no longer being referenced, Music and video files, Old software/computer programs/apps no longer being used, Social media/Online game friends and following, Some social media platforms also provide opportunity for digital hoarding. On the social networking site Facebook, for example, one can accumulate a vast number of “friends”, even reaching the maximum limit of 5000 for example, that may merely be acquaintances or lapsed contacts or even complete strangers.[16] Groups and Pages can also contribute to clutter when users join and like new ones, respectively, without leaving or unfollowing those in which they are no longer interested." },
    { title: "Motivations", content: "Digital hoarding stems from a mix of individual habits, corporate conditions, and societal trends. Many businesses depend on email correspondence for decision-making and formal approvals, leading employees to keep work emails as a record of decisions. With data storage devices becoming larger and cheaper, individuals and companies often do not feel the need to be selective about what they save. The widespread availability of digital media allows users to accumulate content more quickly than ever. Since digital files do not take up physical space, they are less likely to be perceived as clutter, making it easy for users to forget what they own. Additionally, unlike many physical items, electronic content does not naturally decay and often goes unnoticed unless users actively choose to delete it." },
    { title: "What are the repercussions?", content: "Digital hoarding can lead to several issues, including mental strain, reduced productivity, and increased digital storage demands. Cluttered digital spaces require time and attention, making tasks like managing an overwhelming inbox mentally draining and reducing employee efficiency. Hoarding digital content can also foster an unhealthy attachment, resembling media addiction, while decluttering devices may improve mental well-being. Additionally, excessive digital content consumes unnecessary hard drive space, sometimes requiring extra storage. On a larger scale, server farms storing vast amounts of digital data demand more electricity, increasing both costs and environmental impact, particularly in corporate settings." },
    { title: "Media coverage", content: "Many American documentary television series, such as Hoarding: Buried Alive on TLC and Hoarders on A&E, depict the struggles of compulsive hoarders, raising awareness of the consequences of accumulating clutter, though they typically focus on physical hoarding. A notable exception is the WPTV story of Larry Fisher, a Fort Lauderdale resident who refused to delete any digital content, instead purchasing a new computer each time he ran out of storage. In contrast, a BBC News story on Washington, D.C., resident Chris Yurista presented a different perspective, portraying him as a 21st-century minimalist who owned few physical assets, opting instead to store his possessions digitally." },
    { title: "More related concepts", content: "Digital clutter refers to the digital artifacts that accumulate due to digital hoarding but can also result from other user activities, such as the buildup of desktop icons from frequent software installations, which does not necessarily indicate an intent to hoard. The process of managing digital clutter, often called housekeeping, involves either discarding unnecessary files, organizing them, or recognizing their importance so they no longer contribute to clutter. Additionally, gadget hoarding, which involves accumulating electronic hardware like computers, cellphones, cables, and audio equipment, can occur alongside digital hoarding, further contributing to excessive digital and physical accumulation." },
    { title: "Death by 1000 Tabs", content: "— It all came crashing down when I moved back to the US. The lack of good public transportation has yet another downside. There is no reading while driving, and my enjoyable commutes by bike or foot also didn’t give me opportunities to read. Things quickly spiraled from there. Combined with the ever increasing amount of content out there, it wasn’t long before I became buried in tabs. Sometimes I would organize tabs into windows or try to make some order out of the chaos by dedicating an entire browser to a specific type of tab. It never really took. (By John Kehayias for Medium)" },
    { title: "ADHD and Tab Hoarding", content: "The widespread integration of computers into daily life, fueled by the internet, has made digital literacy essential. However, internet browsing habits, especially excessive tab use, remain largely self-taught. A common analogy for ADHD likens it to having too many browser tabs open, and many individuals with ADHD struggle with tab overload. This behavior stems from factors like loss aversion, the fear of losing access to information, and the sunk cost fallacy, where keeping tabs open feels justified due to time invested. ADHD-related challenges with working memory and task-switching exacerbate this issue, making tabs a way to supplement memory. Managing excessive tabs can involve using browser extensions like OneTab or Workona, setting limits on open tabs, bookmarking links, or organizing notes separately. The most challenging but effective solution is learning to let go—accepting that truly important information can be rediscovered, reducing the mental burden of digital clutter." },
    { title: "How to overcome tab hoarding (at least try)", content: "Use tab management tools like MaxFocus, a link preview extension that lets you preview links without leaving them open, helping to reduce tab clutter while keeping your browser clean. Setting a tab limit can also be effective—choose a maximum number of open tabs, such as 5 or 10, and close or save extra ones when you reach that limit. This forces you to prioritize what’s truly important. The Vivaldi browser, for example, allows users to set a tab limit and automatically closes the least-used tabs once the limit is reached. Another helpful strategy is bookmarking tabs for later instead of keeping them open. Organizing bookmarks into folders makes it easier to find information when needed, keeping your browser uncluttered without the risk of losing valuable content." },
    { title: "More tips", content: "Focus on one tab and one task at a time, closing the tab once you're done to prevent distractions and task-switching. Using tab suspension tools like OneTab can also help by putting unused tabs to sleep, saving computer memory while allowing you to return to them later. Additionally, make it a habit to clear your tabs regularly—at the end of each day, take a moment to close any tabs you no longer need. This simple practice helps declutter your browser, clears your mind, and gives you a fresh start the next day." },
    { title: "In the end, it's not your fault", content: "It's not entirely your fault—digital hoarding happens because it's more cost-efficient to keep everything than to spend time deciding what to delete. Technology has advanced to the point where storage is so cheap that forgetting has become more expensive than remembering. As one analysis points out, if it takes just three seconds to decide whether to keep an image and a person values their time at an average wage, the cost of making that decision exceeds the cost of storing the file, even with a backup. In short, digitization, cheap storage, and the acceleration of capitalist production mechanisms have not only undermined the ideals of 21st-century minimalism but have also fueled its opposite—digital hoarding." }
];

let windowIndex = 0;
function openNextWindow() {
    if (windowIndex < articles.length) {
        openDivWindow(articles[windowIndex].title, articles[windowIndex].content);
        windowIndex++;
    }
}

function openDivWindow(title, content) {
    const newWindow = document.createElement('div');
    newWindow.classList.add('window');
    newWindow.style.top = Math.random() * (window.innerHeight - 420) + 'px';
    newWindow.style.left = Math.random() * (window.innerWidth - 620) + 'px';
    
    const header = document.createElement('div');
    header.classList.add('window-header');
    
    const titleElement = document.createElement('span');
    titleElement.textContent = title;
    
    const closeBtn = document.createElement('button');
    closeBtn.classList.add('close-btn');
    closeBtn.textContent = 'x';
    closeBtn.onclick = () => newWindow.remove();
    
    header.appendChild(titleElement);
    header.appendChild(closeBtn);
    newWindow.appendChild(header);
    
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('window-content');
    contentDiv.innerHTML = `<h2>${title}</h2><p>${content}</p>`;
    newWindow.appendChild(contentDiv);
    
    document.body.appendChild(newWindow);
    
    makeDraggable(newWindow, header);
}

function makeDraggable(element, handle) {
    let offsetX = 0, offsetY = 0, isDragging = false;
    
    handle.onmousedown = function(e) {
        isDragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
        document.onmousemove = function(e) {
            if (isDragging) {
                element.style.left = (e.clientX - offsetX) + 'px';
                element.style.top = (e.clientY - offsetY) + 'px';
            }
        }
        document.onmouseup = function() {
            isDragging = false;
            document.onmousemove = null;
            document.onmouseup = null;
        }
    }
}


document.addEventListener("DOMContentLoaded", function () {
    // Create a container for the article
    const articleContainer = document.createElement("div");
    articleContainer.id = "tab-hoarding-article";
    articleContainer.classList.add("content");
    articleContainer.style.maxWidth = "800px";
    articleContainer.style.margin = "50px auto";
    articleContainer.style.padding = "20px";
    articleContainer.style.background = "white";
    articleContainer.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.1)";
    articleContainer.style.textAlign = "center";
    articleContainer.style.height = "85vh";
    articleContainer.style.overflowY = "auto";
    
    // Article title
    const title = document.createElement("h1");
    title.textContent = "Death by 1,000 Tabs: Confessions of a Tab Hoarder";
    articleContainer.appendChild(title);

    const paragraph = document.createElement("h4");
    paragraph.textContent = "By John Kehayias | January 21, 2021, 10:00am";
    articleContainer.appendChild(paragraph);
    
    // Image sources (dummy placeholders for now)
    const imageSources = [
        // "image1.png",
        "image2.png",
        // "image3.jpg",
        // "image4.jpg"
    ];
    
    // Add images to the article
    imageSources.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "An illustration of tab hoarding";
        img.style.width = "100%";
        img.style.margin = "20px 0";
        articleContainer.appendChild(img);
    });
    
    // Article paragraphs
    const paragraphs = [
        "New Year’s Day—a time for renewal, a chance to start with a clean slate. I’m not one for resolutions, but I do take the opportunity to tidy up: wiping down my grimy phone, dusting off the monitor, and doing some digital purging—deleting unused apps, clearing history, and similar tasks. This year, however, in a sudden fit of bravery, I did something I haven’t done in years, maybe ever—something that fills me with great anxiety.",
        "I closed my browser tabs. All 1,314 of them. There’s no denying it: I’m a tab hoarder.",
        "How did I get to this point? Not the closing, that was more an act (crime?) of passion than cold-blooded calculation. No, how did I end up with a dozen browser windows with ever scrolling tabs, spread across 4 devices? And will this really be part of a change to a life of, if not minimalism, than at least digital sanity? Is that what I even want?",
        "My tab hoarding started around the turn of the millennium, when I was but a young college student discovering a little browser called Phoenix (later to become Firefox). The idea of having multiple sites open at the same time was amazing, and coupled with things like ad-blocking extensions, it was exactly the right time to be coming of age with the internet.",
        "I started opening up new tabs—here’s a cool story to read later, a neat program to download, some advice on how to stop procrastinating—and on and on. Each tab seemed interesting, useful, or weird at some point, but I never had time to look at them right away, or perhaps ever. Looking back, all I’ve really done is open more and more, acquiring more devices to run more browsers, always pushing my computers to their limits. I upgraded my RAM, got a better CPU, and yet, the main thing I did with my improved computer? Open more tabs.",
        "My computer would crash. I can still feel that sudden catch of breath, that sinking feeling when I think it could all be gone. All that information, I was saving it for just the right time, a modern retelling of that classic Twilight Zone episode.",
        "I would not be deterred. More technology was the answer, not self-restraint.",
        "Studies suggest that tab hoarding may be linked to our brain’s way of categorizing unfinished tasks, making it hard to let go.",
        "I tried all sorts of browser extensions that would save open tabs and restore them, back them up, any type of insurance policy for my collection of websites. Sometimes I would make a massive list of bookmarks, and then look into making sure that got backed up or synced to other computers. Still, I lost tabs from time to time. Surely they were amazing websites or articles, lost to me forever in my thirst for more.",
        "For a while I even had a good routine while I was living in Tokyo. Before I left for work I would skim through my feeds of frequently-read websites, discarding what wasn’t interesting and saving the rest. I could then read these on my tablet without an internet connection on the train. My feed list was near zero, my read-it-later list quickly dwindled, I was even finishing a book every few weeks. I was on top of my information diet.",
        "It all came crashing down when I moved back to the US. The lack of good public transportation has yet another downside. There is no reading while driving, and my enjoyable commutes by bike or foot also didn’t give me opportunities to read. Things quickly spiraled from there. Combined with the ever increasing amount of content out there, it wasn’t long before I became buried in tabs. Sometimes I would organize tabs into windows or try to make some order out of the chaos by dedicating an entire browser to a specific type of tab. It never really took.",
        "I didn’t realize how out of control it was until seeing my brother diligently working with just a handful of tabs. I couldn’t understand it. Then I showed him how I lived, poor guy nearly collapsed from the stress of seeing me scrolling on and on through all my tabs. And that was just one window.",
        "That is how I lived. It has gotten easier to be a tab hoarder. Browsers work better, they seem to embrace the lifestyle of people like me, asking to restore tabs when you re-open (even after a crash), keeping those tabs from hogging up resources until you are ready for them.",
        "No more forced blank slates. I’ve kept my computers for longer too, and new devices simply sync up with where you left off.",
        "Why do we do this? I know I’m not alone—probably in the majority, if a bit on the extreme end. I laugh when I see articles about having “many” tabs open—dozens? Please, that’s not a knife. There are several reasons we do this, familiar to any tab hoarder: digital FOMO, the fear of missing out on stories or insights, which is why I use a feed reader to track my favorite websites; procrastination, where clicking on endless links feels productive but rarely leads to actually reading them; the messy desk syndrome, where our computers replace cluttered workspaces, filling desktops with files and browsers with half the internet; and simply because we can—just as we pack a suitcase to its limit, we fill every available space, a tendency even the inventor of browser tabs, Adam Stiles, acknowledged when he said, “perhaps it gives some people too much freedom.” And then, on New Year’s Day, I closed them all. I now manage with just a few, opening what I need and closing them afterward. Novel, I know. It feels easier now because each tab is significant in a way it never could be when it was one of a thousand; there is an aesthetic to keep, a sense of order to maintain. I am liberated—free of the baggage of things I was going to do, read, or learn. I declared tab bankruptcy, accepting the never-ending flood of information in our online world. But I am also lost. A blank slate is intimidating, and I know I am just a few clicks away from the dam breaking again. There was comfort in those old tabs—things I took the time to find and open, believing I’d get to them one day. Gone. Are there benefits to this? Maybe. My computer feels snappier—perhaps a placebo. I do think more carefully about what I open: will I use this now? Should I save it for later? Strict limits seem like a poor substitute for addressing why I feel the urge to open tabs, what is truly valuable to read, and how I want to spend my time. I dipped into my old read-it-later list, which I’ve barely added to in years. It has 2,537 items. But at least the tabs are gone, right? Not quite. Before closing them, I bookmarked them into a jumble of folders, joining the other times I tried to clean house. The name of the top folder, where I hide my shame? “Temp.” There’s a Greek proverb my father once told me: nothing is more permanent than the temporary." 
    ];
    
    paragraphs.forEach(text => {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        articleContainer.appendChild(paragraph);
    });
    
    // Append article to the body
    document.body.appendChild(articleContainer);
});
