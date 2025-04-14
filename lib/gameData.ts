// Game data including challenges and settings
import { Challenge, GameSettings, GameState } from './types';

export const challenges: Challenge[] = [
  {
    id: 1,
    title: "The Chamber of Claims",
    description: "Distinguish between effective and ineffective thesis statements.",
    instructions: "Identify the 3 properly constructed thesis statements (debatable, specific, clear) and arrange them in sequence from weakest to strongest.",
    content: {
      statements: [
        { id: 1, text: "Social media has changed how people communicate.", value: 3 },
        { id: 2, text: "The Earth revolves around the sun.", value: 0 },
        { id: 3, text: "Instagram's algorithm-based content delivery has negatively impacted teenage self-esteem by promoting unrealistic beauty standards.", value: 7 },
        { id: 4, text: "Cats make good pets because they are independent.", value: 5 },
        { id: 5, text: "The legal voting age should be lowered to 16 in the United States because adolescents who work and pay taxes deserve representation.", value: 6 },
        { id: 6, text: "Many people like pizza.", value: 0 },
        { id: 7, text: "Climate change is happening.", value: 0 },
        { id: 8, text: "Schools should have longer lunch periods.", value: 0 },
        { id: 9, text: "Renewable energy is important.", value: 0 }
      ],
      solution: "357" // The code is formed by ordering statements 3, 5, 7 from weakest to strongest
    },
    hints: [
      "Look for statements that can be argued against, not just facts.",
      "The strongest thesis makes a specific, debatable claim about a meaningful issue.",
      "The code arranges the statements from least to most specific."
    ],
    timePenalty: 2 // minutes
  },
  {
    id: 2,
    title: "The Evidence Vault",
    description: "Match appropriate evidence types to claims and differentiate between ethos, pathos, and logos.",
    instructions: "Sort the evidence into the correct categories (Ethos, Pathos, Logos) and identify which evidence best supports each claim.",
    content: {
      categories: ["Ethos", "Pathos", "Logos"],
      claims: [
        { id: 1, text: "Climate change requires immediate action" },
        { id: 2, text: "College education should be free" },
        { id: 3, text: "Social media regulations should be strengthened" }
      ],
      evidence: [
        { id: 1, type: "ethos", text: "According to Dr. Jane Smith, climate scientist with 20 years of research experience, we are approaching irreversible tipping points." },
        { id: 2, type: "pathos", text: "Think of the future generations who will inherit a world ravaged by extreme weather if we fail to act now." },
        { id: 3, type: "logos", text: "Research shows global temperatures have risen 1.1°C since pre-industrial times, with 19 of the 20 warmest years occurring since 2000." },
        { id: 4, type: "ethos", text: "Professor Williams, an economics researcher at Harvard, argues that free college would boost economic growth by 2% annually." },
        { id: 5, type: "pathos", text: "Maria had to drop out of college due to mounting debt, crushing her lifelong dream of becoming a doctor." },
        { id: 6, type: "logos", text: "Countries with free higher education have 15% higher workforce participation and 22% higher average salaries." },
        { id: 7, type: "ethos", text: "Former tech executive and whistleblower Sarah Johnson warns that current regulations fail to protect user privacy." },
        { id: 8, type: "pathos", text: "Children as young as 8 are developing anxiety and depression from social media addiction and cyberbullying." },
        { id: 9, type: "logos", text: "A recent study found that 78% of personal data breaches originated from poorly regulated social media platforms." },
        { id: 10, type: "logos", text: "The average person spends 2.5 hours daily on social media, which some claim is too much time." },
        { id: 11, type: "ethos", text: "My friend who works at a tech company says most social media is designed to be addictive." },
        { id: 12, type: "pathos", text: "Everyone knows that social media is ruining our ability to have real conversations." }
      ],
      traps: [10, 11, 12], // IDs of fallacious evidence pieces
      solution: "RHETORIC" // The word revealed when correct matches are made
    },
    hints: [
      "Ethos appeals to credibility, pathos to emotion, logos to logic.",
      "Each claim needs exactly one piece of each type of evidence.",
      "The Sophist has planted 3 fallacious pieces of evidence as traps."
    ],
    timePenalty: 2
  },
  {
    id: 3,
    title: "The Audience Analysis Matrix",
    description: "Adapt arguments for different audiences using appropriate appeals.",
    instructions: "Complete the grid by selecting the most effective approach for each audience and topic combination.",
    content: {
      audiences: ["Business Executives", "Environmental Activists", "Parents"],
      topics: ["Renewable Energy", "Education Reform", "Technology Regulation"],
      approaches: [
        // Renewable Energy approaches
        { id: 1, audience: "Business Executives", topic: "Renewable Energy", text: "Focus on cost savings and long-term ROI of green energy investments", correct: true },
        { id: 2, audience: "Business Executives", topic: "Renewable Energy", text: "Emphasize moral obligation to save the planet", correct: false },
        { id: 3, audience: "Environmental Activists", topic: "Renewable Energy", text: "Present statistics on carbon reduction potential", correct: false },
        { id: 4, audience: "Environmental Activists", topic: "Renewable Energy", text: "Focus on ecosystem protection and sustainability for future generations", correct: true },
        { id: 5, audience: "Parents", topic: "Renewable Energy", text: "Highlight health benefits for children from reduced pollution", correct: true },
        { id: 6, audience: "Parents", topic: "Renewable Energy", text: "Emphasize technical specifications of solar panels", correct: false },
        
        // Education Reform approaches
        { id: 7, audience: "Business Executives", topic: "Education Reform", text: "Focus on producing skilled workforce for future employment needs", correct: true },
        { id: 8, audience: "Business Executives", topic: "Education Reform", text: "Emphasize creativity and arts education", correct: false },
        { id: 9, audience: "Environmental Activists", topic: "Education Reform", text: "Highlight environmental education and sustainability curriculum", correct: true },
        { id: 10, audience: "Environmental Activists", topic: "Education Reform", text: "Focus on standardized testing improvements", correct: false },
        { id: 11, audience: "Parents", topic: "Education Reform", text: "Emphasize individual student success and personalized learning", correct: true },
        { id: 12, audience: "Parents", topic: "Education Reform", text: "Focus on administrative efficiency", correct: false },
        
        // Technology Regulation approaches
        { id: 13, audience: "Business Executives", topic: "Technology Regulation", text: "Emphasize regulatory certainty and clear compliance frameworks", correct: true },
        { id: 14, audience: "Business Executives", topic: "Technology Regulation", text: "Focus on ethical technology use", correct: false },
        { id: 15, audience: "Environmental Activists", topic: "Technology Regulation", text: "Highlight regulations that reduce e-waste and energy consumption", correct: true },
        { id: 16, audience: "Environmental Activists", topic: "Technology Regulation", text: "Emphasize innovation protection", correct: false },
        { id: 17, audience: "Parents", topic: "Technology Regulation", text: "Focus on child safety, privacy protection, and healthy development", correct: true },
        { id: 18, audience: "Parents", topic: "Technology Regulation", text: "Emphasize economic benefits of technology", correct: false }
      ],
      solution: "PERSUADE" // The word revealed when correct matches are made
    },
    hints: [
      "Business audiences respond to data and profit potential.",
      "Consider each audience's core values and concerns.",
      "The most effective approaches balance multiple appeals but prioritize one."
    ],
    timePenalty: 2
  },
  {
    id: 4,
    title: "The Counterargument Labyrinth",
    description: "Navigate through counterarguments and refutations to strengthen original claims.",
    instructions: "Navigate the maze by selecting the strongest response to each counterargument. Watch out for logical fallacies that lead to dead ends!",
    content: {
      startPoint: "Claim: Standardized testing should be eliminated from college admissions.",
      paths: [
        {
          id: 1,
          counterargument: "Standardized tests provide an objective measure for comparing students from different schools.",
          options: [
            {
              id: "1A",
              text: "Tests aren't objective because wealthy students can afford test prep.",
              correct: true,
              next: 2
            },
            {
              id: "1B",
              text: "Anyone who thinks tests are fair is privileged and ignorant.",
              correct: false,
              fallacy: "Ad Hominem"
            },
            {
              id: "1C",
              text: "Finland doesn't use standardized testing and has a great education system.",
              correct: false,
              fallacy: "Red Herring"
            }
          ]
        },
        {
          id: 2,
          counterargument: "Without standardized testing, college admissions would rely more on subjective factors like essays and recommendations.",
          options: [
            {
              id: "2A",
              text: "Studies show essays and recommendations predict college success better than test scores.",
              correct: true,
              next: 3
            },
            {
              id: "2B",
              text: "College admissions have always been subjective, so it doesn't matter.",
              correct: false,
              fallacy: "Appeal to Tradition"
            },
            {
              id: "2C",
              text: "If we eliminate standardized testing, grade inflation will destroy academia.",
              correct: false,
              fallacy: "Slippery Slope"
            }
          ]
        },
        {
          id: 3,
          counterargument: "Some students perform poorly in coursework but excel on standardized tests, which gives them a chance to demonstrate their abilities.",
          options: [
            {
              id: "3A",
              text: "These cases are rare exceptions and don't justify the harm tests cause to most students.",
              correct: true,
              next: 4
            },
            {
              id: "3B",
              text: "Those students should just work harder on their coursework.",
              correct: false,
              fallacy: "Oversimplification"
            },
            {
              id: "3C",
              text: "My friend is terrible at tests but is very smart, so tests are clearly worthless.",
              correct: false,
              fallacy: "Anecdotal Evidence"
            }
          ]
        },
        {
          id: 4,
          counterargument: "Many colleges have already gone test-optional and haven't seen significant changes in the diversity or quality of admitted students.",
          options: [
            {
              id: "4A",
              text: "Test-optional policies don't go far enough because students still feel pressure to submit scores if they have them.",
              correct: true,
              next: "end"
            },
            {
              id: "4B",
              text: "Those colleges must be lying about their data.",
              correct: false,
              fallacy: "Conspiracy Thinking"
            },
            {
              id: "4C",
              text: "But Harvard still requires tests, and they're the best university.",
              correct: false,
              fallacy: "Appeal to Authority"
            }
          ]
        }
      ],
      solution: "LOGIC"
    },
    hints: [
      "The strongest refutations acknowledge the counterargument's merit before responding.",
      "Watch for fallacies that misrepresent the original argument.",
      "Choose responses that use evidence rather than emotion or attacks."
    ],
    timePenalty: 2
  },
  {
    id: 5,
    title: "The Synthesis Sanctum",
    description: "Construct a complete, persuasive argument incorporating all elements.",
    instructions: "Reconstruct a persuasive argument by placing the components in the correct order. Watch out for red herrings that don't belong!",
    content: {
      components: [
        { id: 1, type: "thesis", text: "Public libraries should receive increased government funding because they provide essential services that promote equity and community well-being.", correct: true },
        { id: 2, type: "reason1", text: "Libraries provide free access to information and technology for those who cannot afford it.", correct: true },
        { id: 3, type: "evidence1", text: "A 2023 study found that 26% of low-income Americans rely on libraries for internet access, with usage increasing 15% annually.", correct: true },
        { id: 4, type: "reason2", text: "Libraries serve as community centers that foster social connections and provide safe spaces.", correct: true },
        { id: 5, type: "evidence2", text: "Libraries host over 5.2 million community programs annually, serving over 129 million participants of all ages and backgrounds.", correct: true },
        { id: 6, type: "reason3", text: "Libraries offer educational support and literacy programs that benefit children and adults.", correct: true },
        { id: 7, type: "evidence3", text: "Children who participate in summer reading programs score 52% higher on reading assessments than non-participants.", correct: true },
        { id: 8, type: "counterargument", text: "Some argue that libraries are becoming obsolete in the digital age when many resources are available online.", correct: true },
        { id: 9, type: "refutation", text: "However, digital access remains unequal, with 19 million Americans lacking reliable internet, and libraries increasingly provide digital literacy training alongside traditional services.", correct: true },
        { id: 10, type: "conclusion", text: "By increasing funding for public libraries, governments invest in equitable access to information, community building, and lifelong learning that strengthens democratic society.", correct: true },
        { id: 11, type: "redherring1", text: "Some people prefer e-books to physical books because they are more convenient to carry.", correct: false },
        { id: 12, type: "redherring2", text: "Library architecture has evolved significantly over the past century.", correct: false },
        { id: 13, type: "redherring3", text: "A library card is free in most counties across the United States.", correct: false },
        { id: 14, type: "redherring4", text: "The first public lending library in America was established by Benjamin Franklin in 1731.", correct: false },
        { id: 15, type: "redherring5", text: "Libraries should open earlier in the morning to accommodate more visitors.", correct: false }
      ],
      flaws: [
        { id: 1, text: "The conclusion introduces a new argument about democratic society not previously discussed." },
        { id: 2, text: "The evidence for community programs uses statistics without citing their source." },
        { id: 3, text: "The refutation doesn't fully address the counterargument about digital resources replacing physical ones." }
      ],
      order: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      solution: "PERSUASION"
    },
    hints: [
      "The thesis should come first, but what truly matters is how the reasons connect to it.",
      "Not all components belong - some are designed to weaken your argument.",
      "The conclusion should do more than restate the thesis - it should elevate the discussion."
    ],
    timePenalty: 2
  }
];

export const gameSettings: GameSettings = {
  totalTime: 75, // minutes
  hintsAvailable: 3,
  timePenaltyPerHint: 2, // minutes
  timePenaltyPerWrongAnswer: 3, // minutes
};

export const initialGameState: GameState = {
  currentChallenge: 1,
  completedChallenges: [],
  hintsUsed: {},
  totalPenalties: 0,
  startTime: Date.now(),
  teamId: '',
  teamName: ''
};