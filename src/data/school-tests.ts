// src/data/school-tests.ts
// Authentic "Module 3 Topic A Daily Grade" School Assessment (Cambium/TFAR Bank)
// + Pattern-Matched Twin Questions for Unlimited Retakes & Mastery

export interface GuidedWorkStep {
  stepNumber: number;
  label: string;
  placeholder: string;
  expectedValue: string;
  acceptableValues?: string[];
  helperText: string;
}

export interface Base10ModelVisual {
  name: string;
  hundreds: number;
  tens: number;
  ones: number;
}

export interface TableVisual {
  title: string;
  headers: [string, string];
  rows: [number | string, number | string][];
}

export interface FourTablesOption {
  id: string; // A, B, C, D
  title: string;
  headers: [string, string];
  rows: [number, number][];
}

export interface SchoolTestQuestion {
  id: string;
  questionNumber: number;
  sourceType: "original_school_test" | "twin_practice";
  patternGroup: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  patternTitle: string;
  teks: string;
  prompt: string;
  visualType?:
    | "none"
    | "place_value_number"
    | "base10_models"
    | "single_table"
    | "four_tables"
    | "sentence_fill"
    | "equation_boxes";
  highlightedNumber?: string;
  base10Models?: Base10ModelVisual[];
  tableData?: TableVisual;
  fourTables?: FourTablesOption[];
  wordBank?: { id: string; label: string }[];
  sentenceTemplate?: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  guidedSteps: GuidedWorkStep[];
  teacherFeedbackOnMistake: string;
  workedExplanation: string;
}

export const SCHOOL_TEST_QUESTIONS: SchoolTestQuestion[] = [
  // =========================================================================
  // QUESTION 1 (Original School Test) - Multiplication as Comparison (3.5C)
  // =========================================================================
  {
    id: "school-m3ta-q1",
    questionNumber: 1,
    sourceType: "original_school_test",
    patternGroup: 1,
    patternTitle: "Pattern #1: Multiplication Expression as Comparison (2 × 9)",
    teks: "3.5C",
    prompt:
      "Haruko did 9 sit-ups in P.E. class. The number of sit-ups Tom did can be represented by this expression:\n\n2 × 9\n\nWhich statement is true?",
    visualType: "none",
    options: [
      { id: "A", text: "Tom did 2 times as many sit-ups as Haruko." },
      { id: "B", text: "Haruko did 2 times as many sit-ups as Tom." },
      { id: "C", text: "Tom did 2 more sit-ups than Haruko." },
      { id: "D", text: "Haruko did 2 more sit-ups than Tom." },
    ],
    correctAnswer: "A",
    guidedSteps: [
      {
        stepNumber: 1,
        label: "How many sit-ups did Haruko do?",
        placeholder: "Sample: 5",
        expectedValue: "9",
        helperText: "Look at the first sentence in the problem to find Haruko's number.",
      },
      {
        stepNumber: 2,
        label: "What does the symbol × mean in words? ('times as many' or 'more than')",
        placeholder: "Type the matching phrase...",
        expectedValue: "times as many",
        acceptableValues: ["times", "times as many", "groups of", "2 groups of 9"],
        helperText: "Remember: '+' means 'more than', while '×' means equal groups ('times as many').",
      },
      {
        stepNumber: 3,
        label: "Calculate Tom's total sit-ups (2 × 9):",
        placeholder: "Sample: 14",
        expectedValue: "18",
        helperText: "Multiply the two numbers (for example, 2 groups of 7 = 14).",
      },
    ],
    teacherFeedbackOnMistake:
      "Great job on the paper test! Remember: write '2 groups of 9 = 18' and cross out 'more than' choices because 'more than' means addition (+).",
    workedExplanation:
      "Haruko did 9 sit-ups. Tom's sit-ups are 2 × 9 = 18. The multiplication sign (×) means 'times as many', so Tom did 2 times as many sit-ups as Haruko (Choice A).",
  },

  // =========================================================================
  // QUESTION 2 (Original School Test) - Sentence Drop-down Comparison (3.5C)
  // =========================================================================
  {
    id: "school-m3ta-q2",
    questionNumber: 2,
    sourceType: "original_school_test",
    patternGroup: 2,
    patternTitle: "Pattern #2: Complete the Comparison Sentence (8 × 3)",
    teks: "3.5C",
    prompt:
      "Alex scored 8 points in a basketball game. The expression shows the number of points that Sara scored:\n\n8 × 3\n\nComplete the statement to compare the numbers of points scored by Alex and Sara.\n\nWord Bank:\n(A) Sara   (B) Alex   (C) 8   (D) 3   (E) more points than   (F) times as many points as\n\n[ Box 1 ] scored [ Box 2 ] [ Box 3 ] [ Box 4 ] did.",
    visualType: "sentence_fill",
    wordBank: [
      { id: "A", label: "(A) Sara" },
      { id: "B", label: "(B) Alex" },
      { id: "C", label: "(C) 8" },
      { id: "D", label: "(D) 3" },
      { id: "E", label: "(E) more points than" },
      { id: "F", label: "(F) times as many points as" },
    ],
    options: [
      {
        id: "A",
        text: "Sara (A) scored 3 (D) times as many points as (F) Alex (B) did.",
      },
      {
        id: "B",
        text: "Alex (B) scored 3 (D) times as many points as (F) Sara (A) did.",
      },
      {
        id: "C",
        text: "Sara (A) scored 3 (D) more points than (E) Alex (B) did.",
      },
      {
        id: "D",
        text: "Sara (A) scored 8 (C) times as many points as (F) Alex (B) did.",
      },
    ],
    correctAnswer: "A",
    guidedSteps: [
      {
        stepNumber: 1,
        label: "How many points did Alex score?",
        placeholder: "Sample: 6",
        expectedValue: "8",
        helperText: "Check the first sentence for Alex's score.",
      },
      {
        stepNumber: 2,
        label: "How many points did Sara score (8 × 3)?",
        placeholder: "Sample: 18",
        expectedValue: "24",
        helperText: "Add 8 three times or multiply 8 × 3 (for example, 6 × 3 = 18).",
      },
      {
        stepNumber: 3,
        label: "Who scored more points (Sara or Alex), and by what factor?",
        placeholder: "Sample: Name, 4",
        expectedValue: "Sara",
        acceptableValues: ["Sara", "Sara, 3", "3", "Sara 3"],
        helperText: "Compare the two totals to see who has the larger score and how many times as many.",
      },
    ],
    teacherFeedbackOnMistake:
      "On your test paper, you wrote 8 × 3 = 24 and 8 + 8 + 8 = 24, and got A - D - F - B completely right!",
    workedExplanation:
      "Alex scored 8 points. Sara scored 8 × 3 = 24 points. That means Sara (A) scored 3 (D) times as many points as (F) Alex (B) did.",
  },

  // =========================================================================
  // QUESTION 3 (Original School Test) - Place Value Multipliers (3.2B)
  // =========================================================================
  {
    id: "school-m3ta-q3",
    questionNumber: 3,
    sourceType: "original_school_test",
    patternGroup: 3,
    patternTitle: "Pattern #3: Place Value 10× / 100× / 10,000× Jumps (858,386)",
    teks: "3.2B",
    prompt:
      "A number is shown:\n\n858,386\n\nCompare the value of 8 in each place value. Choose the correct answer for each sentence:\n\nSentence 1: The value of the 8 in the hundred thousands place is [ 10 | 100 | 1,000 | 10,000 | 100,000 ] times greater than the value of the 8 in the thousands place.\n\nSentence 2: The value of the 8 in the hundred thousands place is [ 10 | 100 | 1,000 | 10,000 | 100,000 ] times greater than the value of the 8 in the tens place.",
    visualType: "place_value_number",
    highlightedNumber: "858,386",
    options: [
      {
        id: "A",
        text: "Sentence 1: 10 (A)  |  Sentence 2: 10,000 (D)",
      },
      {
        id: "B",
        text: "Sentence 1: 100 (B)  |  Sentence 2: 10,000 (D)",
      },
      {
        id: "C",
        text: "Sentence 1: 100 (B)  |  Sentence 2: 1,000 (C)",
      },
      {
        id: "D",
        text: "Sentence 1: 1,000 (C)  |  Sentence 2: 100,000 (E)",
      },
    ],
    correctAnswer: "B",
    guidedSteps: [
      {
        stepNumber: 1,
        label: "Write the value of the 8 in the Hundred Thousands place:",
        placeholder: "Sample: 500,000",
        expectedValue: "800,000",
        acceptableValues: [
          "800,000",
          "800000",
          "800,000, 8,000, 80",
          "800000, 8000, 80",
        ],
        helperText: "Look at the Hundred Thousands column on the place-value chart above.",
      },
      {
        stepNumber: 2,
        label: "Sentence 1: Count the place-value jumps from Thousands to Hundred Thousands. Multiply ×10 for each jump:",
        placeholder: "Sample: 1,000",
        expectedValue: "100",
        acceptableValues: ["100", "10 x 10 = 100", "2 jumps"],
        helperText: "Each jump left is ×10 (for example: 1 jump = 10; 2 jumps = 10 × 10; 3 jumps = 10 × 10 × 10).",
      },
      {
        stepNumber: 3,
        label: "Sentence 2: Count the jumps from Tens to Hundred Thousands and multiply ×10 for each jump:",
        placeholder: "Sample: 1,000",
        expectedValue: "10,000",
        acceptableValues: ["10,000", "10000", "4 jumps"],
        helperText: "Count every column step from Tens up to Hundred Thousands, multiplying by 10 for each step.",
      },
    ],
    teacherFeedbackOnMistake:
      "Watch out on Sentence 1! On your paper test, you wrote 'A (10)' for Sentence 1 because the two 8s had only one digit (5) between them. Always count ALL place-value steps: Thousands to Ten-Thousands is ×10, and Ten-Thousands to Hundred-Thousands is another ×10, so 10 × 10 = 100!",
    workedExplanation:
      "In 858,386: the 8 in the hundred thousands place is 800,000; the 8 in the thousands place is 8,000 (800,000 ÷ 8,000 = 100, Choice B); the 8 in the tens place is 80 (800,000 ÷ 80 = 10,000, Choice D).",
  },

  // =========================================================================
  // QUESTION 4 (Original School Test) - Place Value Relationship (3.2B)
  // =========================================================================
  {
    id: "school-m3ta-q4",
    questionNumber: 4,
    sourceType: "original_school_test",
    patternGroup: 4,
    patternTitle: "Pattern #4: Place Value Distance Between Thousands and Tens (583,436)",
    teks: "3.2B",
    prompt:
      "What is the relationship between the thousands place and the tens place in the number shown?\n\n583,436",
    visualType: "place_value_number",
    highlightedNumber: "583,436",
    options: [
      {
        id: "A",
        text: "The thousands place is two times greater than the tens place.",
      },
      {
        id: "B",
        text: "The thousands place is ten times greater than the tens place.",
      },
      {
        id: "C",
        text: "The thousands place is one hundred times greater than the tens place.",
      },
      {
        id: "D",
        text: "The thousands place is three hundred times greater than the tens place.",
      },
    ],
    correctAnswer: "C",
    guidedSteps: [
      {
        stepNumber: 1,
        label: "What is the value of the digit in the thousands place of 583,436?",
        placeholder: "Sample: 5,000",
        expectedValue: "3,000",
        acceptableValues: ["3,000", "3000", "3"],
        helperText: "Find the digit in the thousands column and write its value.",
      },
      {
        stepNumber: 2,
        label: "What is the value of the digit in the tens place of 583,436?",
        placeholder: "Sample: 50",
        expectedValue: "30",
        acceptableValues: ["30", "3"],
        helperText: "Find the digit in the tens column and write its value.",
      },
      {
        stepNumber: 3,
        label: "Multiply ×10 for each jump from Tens to Thousands. How many times greater is it?",
        placeholder: "Sample: 1,000",
        expectedValue: "100",
        acceptableValues: ["100", "one hundred"],
        helperText: "Count the jumps from Tens to Thousands and multiply 10 for each jump (not 2 × 1)!",
      },
    ],
    teacherFeedbackOnMistake:
      "Careful Trap Alert! On the paper test, you initially picked A ('two times greater') because the thousands place is 2 jumps away from the tens place. Remember: 2 jumps means ×10 × 10 = 100 times greater (NOT 2 times greater)!",
    workedExplanation:
      "Moving from the tens place (30) to the hundreds place is ×10, and from the hundreds place to the thousands place (3,000) is another ×10. Since 10 × 10 = 100, the thousands place is one hundred times greater than the tens place (Choice C).",
  },

  // =========================================================================
  // QUESTION 5 (Original School Test) - Base-10 Block Equivalence (3.2A)
  // =========================================================================
  {
    id: "school-m3ta-q5",
    questionNumber: 5,
    sourceType: "original_school_test",
    patternGroup: 5,
    patternTitle: "Pattern #5: Comparing 3 Student Base-10 Block Models (Regrouping)",
    teks: "3.2A",
    prompt:
      "Three students made models to represent numbers. The models are shown:\n\n• Anne: 1 hundred flat, 1 ten rod, and 10 unit ones\n• Kareena: 1 hundred flat and 2 unit ones\n• Zane: 12 ten rods\n\nWhich models represent the same number?",
    visualType: "base10_models",
    base10Models: [
      { name: "Anne", hundreds: 1, tens: 1, ones: 10 },
      { name: "Kareena", hundreds: 1, tens: 0, ones: 2 },
      { name: "Zane", hundreds: 0, tens: 12, ones: 0 },
    ],
    options: [
      {
        id: "A",
        text: "Anne's model and Kareena's model, because 1 hundred, 1 ten, and 10 ones is equivalent to 1 hundred and 2 ones.",
      },
      {
        id: "B",
        text: "Kareena's model and Zane's model, because 1 hundred and 2 ones is equivalent to 12 tens.",
      },
      {
        id: "C",
        text: "Anne's model and Zane's model, because 1 hundred, 1 ten, and 10 ones is equivalent to 12 tens.",
      },
      {
        id: "D",
        text: "None of the models.",
      },
    ],
    correctAnswer: "C",
    guidedSteps: [
      {
        stepNumber: 1,
        label: "Find the total value of Anne's model (1 hundred + 1 ten + 10 ones):",
        placeholder: "Sample: 150",
        expectedValue: "120",
        helperText: "Add the value of the hundred flat, ten rod, and unit cubes together.",
      },
      {
        stepNumber: 2,
        label: "Find the total value of Kareena's model (1 hundred + 2 ones):",
        placeholder: "Sample: 105",
        expectedValue: "102",
        helperText: "Remember there are 0 tens in Kareena's model!",
      },
      {
        stepNumber: 3,
        label: "Find the total value of Zane's model (12 tens = 12 × 10):",
        placeholder: "Sample: 140",
        expectedValue: "120",
        helperText: "Remember: 10 tens make 100, then add the remaining tens.",
      },
    ],
    teacherFeedbackOnMistake:
      "Always write the standard number underneath each box first! Once you wrote 120 under Anne, 102 under Kareena, and 120 under Zane on your correction, you immediately saw Anne and Zane match (Choice C)!",
    workedExplanation:
      "Anne's model has 1 hundred (100) + 1 ten (10) + 10 ones (10) = 120. Kareena's model has 1 hundred (100) + 2 ones (2) = 102. Zane's model has 12 tens (12 × 10) = 120. Therefore, Anne's model and Zane's model both equal 120 (Choice C).",
  },

  // =========================================================================
  // QUESTION 6 (Original School Test) - Base-10 Block Equivalence (3.2A/3.2B)
  // =========================================================================
  {
    id: "school-m3ta-q6",
    questionNumber: 6,
    sourceType: "original_school_test",
    patternGroup: 6,
    patternTitle: "Pattern #6: Regrouping 20 Tens into 2 Hundreds (Models X, Y, Z)",
    teks: "3.2A",
    prompt:
      "Which of these models represent the same number?\n\n• Model X: 20 unit ones\n• Model Y: 20 ten rods\n• Model Z: 2 hundred flats",
    visualType: "base10_models",
    base10Models: [
      { name: "Model X", hundreds: 0, tens: 0, ones: 20 },
      { name: "Model Y", hundreds: 0, tens: 20, ones: 0 },
      { name: "Model Z", hundreds: 2, tens: 0, ones: 0 },
    ],
    options: [
      {
        id: "A",
        text: "Model X and Model Y, because 20 ones is equivalent to 20 tens.",
      },
      {
        id: "B",
        text: "Model X and Model Z, because 20 ones is equivalent to 2 hundreds.",
      },
      {
        id: "C",
        text: "Model Y and Model Z, because 20 tens is equivalent to 2 hundreds.",
      },
      {
        id: "D",
        text: "None of these.",
      },
    ],
    correctAnswer: "C",
    guidedSteps: [
      {
        stepNumber: 1,
        label: "What number does Model X represent (20 ones)?",
        placeholder: "Sample: 40",
        expectedValue: "20",
        helperText: "Each unit cube is worth 1.",
      },
      {
        stepNumber: 2,
        label: "What number does Model Y represent (20 tens)?",
        placeholder: "Sample: 400",
        expectedValue: "200",
        helperText: "Multiply the number of ten rods by 10 (remember 10 tens = 100).",
      },
      {
        stepNumber: 3,
        label: "What number does Model Z represent (2 hundreds)?",
        placeholder: "Sample: 400",
        expectedValue: "200",
        helperText: "Multiply the number of hundred flats by 100, then compare X, Y, and Z!",
      },
    ],
    teacherFeedbackOnMistake:
      "Awesome job on Question 6! Writing 200 under Model Y and 200 under Model Z made it super clear.",
    workedExplanation:
      "Model X = 20 ones = 20. Model Y = 20 tens = 200. Model Z = 2 hundreds = 200. Model Y and Model Z both represent 200 because 20 tens is equivalent to 2 hundreds (Choice C).",
  },

  // =========================================================================
  // QUESTION 7 (Original School Test) - Multi-Step Equation Builder (3.4K/3.5B)
  // =========================================================================
  {
    id: "school-m3ta-q7",
    questionNumber: 7,
    sourceType: "original_school_test",
    patternGroup: 7,
    patternTitle: "Pattern #7: Three-Number Equal Groups Equation (4 × 2 × 7)",
    teks: "3.4K",
    prompt:
      "A sports complex has 4 basketball courts. There are 2 bags of basketballs for each court. Each bag contains 7 basketballs.\n\nComplete the equation to represent the total number of basketballs at the sports complex.\n\nOperator Bank: (A) +   (B) −   (C) ×   (D) ÷\n\n4  [ Box 1 ]  2  [ Box 2 ]  7  =  □",
    visualType: "equation_boxes",
    options: [
      { id: "A", text: "4 × 2 × 7 = □   (Both boxes use C: ×)" },
      { id: "B", text: "4 ÷ 2 × 7 = □   (Box 1 is D: ÷, Box 2 is C: ×)" },
      { id: "C", text: "4 + 2 × 7 = □   (Box 1 is A: +, Box 2 is C: ×)" },
      { id: "D", text: "4 + 2 + 7 = □   (Both boxes use A: +)" },
    ],
    correctAnswer: "A",
    guidedSteps: [
      {
        stepNumber: 1,
        label: "Step 1: 4 basketball courts with 2 bags on EACH court. How many total bags?",
        placeholder: "Sample: 10",
        expectedValue: "8",
        acceptableValues: ["8", "4 x 2 = 8", "4*2=8"],
        helperText: "'2 bags for each court' is equal groups—multiply the courts by the bags per court.",
      },
      {
        stepNumber: 2,
        label: "Step 2: Each bag has 7 basketballs. What operation symbol (+, −, ×, ÷) finds the total?",
        placeholder: "Type +, -, ×, or ÷",
        expectedValue: "×",
        acceptableValues: ["×", "x", "*", "multiply", "multiplication", "56"],
        helperText: "When each bag has the same number of balls, decide which operation combines equal groups.",
      },
    ],
    teacherFeedbackOnMistake:
      "Look closely at Box 1! On the test, you wrote 4 × 2 = 8 at the top of the page, which was right! But in the first box you accidentally put 'D (÷)' instead of 'C (×)'. Note that the instructions say: 'Each answer may be used more than once'—so you can use C (×) in BOTH boxes!",
    workedExplanation:
      "To find the total number of bags across 4 courts with 2 bags each, multiply 4 × 2 = 8 bags. Then, since each bag has 7 basketballs, multiply by 7: 4 × 2 × 7 = 56. Both boxes use multiplication (Choice A).",
  },

  // =========================================================================
  // QUESTION 8 (Original School Test) - Input-Output Table Sentence (3.5E)
  // =========================================================================
  {
    id: "school-m3ta-q8",
    questionNumber: 8,
    sourceType: "original_school_test",
    patternGroup: 8,
    patternTitle: "Pattern #8: Describing Input-Output Table Rules (Lilah's Reading)",
    teks: "3.5E",
    prompt:
      "Lilah reads 5 books every month. The table shows the total number of books Lilah reads over time.\n\nComplete the sentence to describe the relationship in the table:\n\nThe number of months [ (A) plus | (B) minus | (C) times | (D) divided by ] [ (A) 2 | (B) 5 | (C) 8 | (D) 10 ] is equal to the number of books Lilah reads.",
    visualType: "single_table",
    tableData: {
      title: "Lilah's Reading",
      headers: ["Number of Months", "Books Read"],
      rows: [
        [2, 10],
        [4, 20],
        [6, 30],
      ],
    },
    options: [
      {
        id: "A",
        text: "The number of months plus (A) 8 (C) is equal to the number of books.",
      },
      {
        id: "B",
        text: "The number of months times (C) 5 (B) is equal to the number of books.",
      },
      {
        id: "C",
        text: "The number of months times (C) 10 (D) is equal to the number of books.",
      },
      {
        id: "D",
        text: "The number of months divided by (D) 5 (B) is equal to the number of books.",
      },
    ],
    correctAnswer: "B",
    guidedSteps: [
      {
        stepNumber: 1,
        label: "Test Row 1: 2 months → 10 books. What number do you multiply 2 by to get 10?",
        placeholder: "Sample: 4",
        expectedValue: "5",
        acceptableValues: ["5", "x5", "×5", "*5"],
        helperText: "Ask yourself: 2 × ? = 10.",
      },
      {
        stepNumber: 2,
        label: "Test Row 2 (4 months → 20) & Row 3 (6 months → 30): Does the same multiplier work for all rows?",
        placeholder: "yes or no",
        expectedValue: "yes",
        acceptableValues: ["yes", "y", "true", "5"],
        helperText: "Multiply 4 and 6 by your number from Step 1 to check if it gives 20 and 30.",
      },
      {
        stepNumber: 3,
        label: "Look at the two brackets in the sentence: which option letters match your rule?",
        placeholder: "Sample: A and D",
        expectedValue: "C and B",
        acceptableValues: ["C and B", "C, B", "CB", "times 5"],
        helperText: "Check the letter in front of the operation word in Bracket 1 and the number in Bracket 2.",
      },
    ],
    teacherFeedbackOnMistake:
      "You knew the math! On your test table, you wrote '×5' on every single row (2 × 5 = 10, 4 × 5 = 20, 6 × 5 = 30), and you even circled (C) times and (B) 5! Just be super careful when writing the letter on the blank line so you write C and B.",
    workedExplanation:
      "In every row of the table, multiplying the number of months by 5 gives the number of books read (2 × 5 = 10, 4 × 5 = 20, 6 × 5 = 30). So the number of months times (C) 5 (B) equals the number of books.",
  },

  // =========================================================================
  // QUESTION 9 (Original School Test) - Matching Story to Table (3.5E)
  // =========================================================================
  {
    id: "school-m3ta-q9",
    questionNumber: 9,
    sourceType: "original_school_test",
    patternGroup: 9,
    patternTitle: "Pattern #9: Matching Equal Groups Rule to the Correct Table (×8)",
    teks: "3.5E",
    prompt:
      "There are 8 oranges in each bag for sale at a store. Which table shows the relationship between the number of bags and the number of oranges in the bags?",
    visualType: "four_tables",
    fourTables: [
      {
        id: "A",
        title: "Table A",
        headers: ["Number of Bags", "Number of Oranges"],
        rows: [
          [2, 8],
          [3, 16],
          [4, 24],
          [5, 32],
        ],
      },
      {
        id: "B",
        title: "Table B",
        headers: ["Number of Bags", "Number of Oranges"],
        rows: [
          [2, 16],
          [3, 24],
          [4, 32],
          [5, 40],
        ],
      },
      {
        id: "C",
        title: "Table C",
        headers: ["Number of Bags", "Number of Oranges"],
        rows: [
          [2, 10],
          [3, 11],
          [4, 12],
          [5, 13],
        ],
      },
      {
        id: "D",
        title: "Table D",
        headers: ["Number of Bags", "Number of Oranges"],
        rows: [
          [2, 16],
          [3, 32],
          [4, 64],
          [5, 128],
        ],
      },
    ],
    options: [
      { id: "A", text: "Table A (2→8, 3→16, 4→24, 5→32)" },
      { id: "B", text: "Table B (2→16, 3→24, 4→32, 5→40)" },
      { id: "C", text: "Table C (2→10, 3→11, 4→12, 5→13)" },
      { id: "D", text: "Table D (2→16, 3→32, 4→64, 5→128)" },
    ],
    correctAnswer: "B",
    guidedSteps: [
      {
        stepNumber: 1,
        label: "If 1 bag has 8 oranges, how many oranges are in 2 bags (2 × 8)?",
        placeholder: "Sample: 12",
        expectedValue: "16",
        helperText: "Multiply 2 bags by the number of oranges in each bag.",
      },
      {
        stepNumber: 2,
        label: "How many oranges are in 3 bags (3 × 8)?",
        placeholder: "Sample: 18",
        expectedValue: "24",
        acceptableValues: ["24", "24 and 32", "24, 32", "32"],
        helperText: "Multiply 3 × 8, 4 × 8, and 5 × 8, then see which table matches all four rows!",
      },
    ],
    teacherFeedbackOnMistake:
      "Spot on! You tested 2 × 8 = 16 and checked every row of Table B!",
    workedExplanation:
      "Since each bag has 8 oranges, multiply the number of bags by 8: 2 × 8 = 16, 3 × 8 = 24, 4 × 8 = 32, 5 × 8 = 40. Table B matches all four rows.",
  },

  // =========================================================================
  // TWIN PRACTICE QUESTIONS (NEW VARIATIONS OF ALL 9 PATTERNS!)
  // =========================================================================

  // Twin of Q1 (Pattern #1: Multiplication Comparison)
  {
    id: "school-twin-q10",
    questionNumber: 10,
    sourceType: "twin_practice",
    patternGroup: 1,
    patternTitle: "Pattern #1 Twin: Multiplication Expression as Comparison",
    teks: "3.5C",
    prompt:
      " Mateo read 6 books over the summer. The number of books Sofia read can be represented by this expression:\n\n4 × 6\n\nWhich statement is true?",
    visualType: "none",
    options: [
      { id: "A", text: "Mateo read 4 times as many books as Sofia." },
      { id: "B", text: "Sofia read 4 more books than Mateo." },
      { id: "C", text: "Sofia read 4 times as many books as Mateo." },
      { id: "D", text: "Mateo read 4 more books than Sofia." },
    ],
    correctAnswer: "C",
    guidedSteps: [
      {
        stepNumber: 1,
        label: "How many books did Mateo read?",
        placeholder: "Sample: 5",
        expectedValue: "6",
        helperText: "Check the first sentence in the story.",
      },
      {
        stepNumber: 2,
        label: "Calculate Sofia's books (4 × 6):",
        placeholder: "Sample: 20",
        expectedValue: "24",
        helperText: "Multiply the two numbers (for example, 4 groups of 5 = 20).",
      },
    ],
    teacherFeedbackOnMistake:
      "Remember: 4 × 6 means 4 groups of Mateo's 6 books, so Sofia read 4 times as many as Mateo.",
    workedExplanation:
      "Mateo read 6 books and Sofia read 4 × 6 = 24 books. The expression 4 × 6 means Sofia read 4 times as many books as Mateo (Choice C).",
  },

  // Twin of Q2 (Pattern #2: Sentence Completion Comparison)
  {
    id: "school-twin-q11",
    questionNumber: 11,
    sourceType: "twin_practice",
    patternGroup: 2,
    patternTitle: "Pattern #2 Twin: Complete the Comparison Sentence",
    teks: "3.5C",
    prompt:
      "Leo collected 7 seashells at the beach. The expression shows the number of seashells Maya collected:\n\n7 × 5\n\nComplete the statement to compare the seashells collected by Leo and Maya.\n\nWord Bank:\n(A) Maya   (B) Leo   (C) 7   (D) 5   (E) more seashells than   (F) times as many seashells as\n\n[ Box 1 ] collected [ Box 2 ] [ Box 3 ] [ Box 4 ] did.",
    visualType: "sentence_fill",
    wordBank: [
      { id: "A", label: "(A) Maya" },
      { id: "B", label: "(B) Leo" },
      { id: "C", label: "(C) 7" },
      { id: "D", label: "(D) 5" },
      { id: "E", label: "(E) more seashells than" },
      { id: "F", label: "(F) times as many seashells as" },
    ],
    options: [
      {
        id: "A",
        text: "Leo (B) collected 5 (D) times as many seashells as (F) Maya (A) did.",
      },
      {
        id: "B",
        text: "Maya (A) collected 5 (D) times as many seashells as (F) Leo (B) did.",
      },
      {
        id: "C",
        text: "Maya (A) collected 5 (D) more seashells than (E) Leo (B) did.",
      },
      {
        id: "D",
        text: "Maya (A) collected 7 (C) times as many seashells as (F) Leo (B) did.",
      },
    ],
    correctAnswer: "B",
    guidedSteps: [
      {
        stepNumber: 1,
        label: "How many seashells did Maya collect (7 × 5)?",
        placeholder: "Sample: 28",
        expectedValue: "35",
        helperText: "Multiply 7 × 5 to find Maya's total seashells.",
      },
      {
        stepNumber: 2,
        label: "How many times as many seashells did Maya collect compared to Leo's 7?",
        placeholder: "Sample: 4",
        expectedValue: "5",
        helperText: "Look at the multiplier in 7 × 5.",
      },
    ],
    teacherFeedbackOnMistake:
      "Always check WHO has the larger amount (Maya = 35) and what the multiplier is (× 5).",
    workedExplanation:
      "Leo collected 7 seashells, and Maya collected 7 × 5 = 35 seashells. Therefore, Maya (A) collected 5 (D) times as many seashells as (F) Leo (B) did.",
  },

  // Twin of Q3 (Pattern #3: Place Value Multipliers - Extra Practice for Missed Question!)
  {
    id: "school-twin-q12",
    questionNumber: 12,
    sourceType: "twin_practice",
    patternGroup: 3,
    patternTitle: "Pattern #3 Twin: Place Value 10× / 100× / 1,000× Jumps",
    teks: "3.2B",
    prompt:
      "A number is shown:\n\n474,249\n\nCompare the value of 4 in each place value. Choose the correct answer to complete both sentences:\n\nSentence 1: The value of the 4 in the hundred thousands place is [ 10 | 100 | 1,000 | 10,000 ] times greater than the value of the 4 in the thousands place.\n\nSentence 2: The value of the 4 in the thousands place is [ 10 | 100 | 1,000 | 10,000 ] times greater than the value of the 4 in the tens place.",
    visualType: "place_value_number",
    highlightedNumber: "474,249",
    options: [
      {
        id: "A",
        text: "Sentence 1: 100 times greater  |  Sentence 2: 100 times greater",
      },
      {
        id: "B",
        text: "Sentence 1: 10 times greater  |  Sentence 2: 10 times greater",
      },
      {
        id: "C",
        text: "Sentence 1: 100 times greater  |  Sentence 2: 1,000 times greater",
      },
      {
        id: "D",
        text: "Sentence 1: 10,000 times greater  |  Sentence 2: 100 times greater",
      },
    ],
    correctAnswer: "A",
    guidedSteps: [
      {
        stepNumber: 1,
        label: "Write the value of the first 4 in the Hundred Thousands place:",
        placeholder: "Sample: 700,000",
        expectedValue: "400,000",
        acceptableValues: ["400,000", "400000", "400,000 and 4,000"],
        helperText: "Check the Hundred Thousands column on the place-value chart.",
      },
      {
        stepNumber: 2,
        label: "Sentence 1: Multiply ×10 for each jump from Thousands to Hundred Thousands:",
        placeholder: "Sample: 1,000",
        expectedValue: "100",
        helperText: "Count the place-value steps from Thousands to Hundred Thousands and multiply 10 for each jump.",
      },
      {
        stepNumber: 3,
        label: "Sentence 2: Multiply ×10 for each jump from Tens to Thousands:",
        placeholder: "Sample: 1,000",
        expectedValue: "100",
        helperText: "Count the place-value steps from Tens to Thousands and multiply 10 for each jump.",
      },
    ],
    teacherFeedbackOnMistake:
      "Count every place value column between the two digits! 2 jumps = 10 × 10 = 100.",
    workedExplanation:
      "In 474,249, the 4s are in the hundred thousands place (400,000), thousands place (4,000), and tens place (40). From 4,000 to 400,000 is 2 place-value jumps (10 × 10 = 100). From 40 to 4,000 is also 2 place-value jumps (10 × 10 = 100).",
  },

  // Twin of Q4 (Pattern #4: Place Value Distance - Extra Practice for Missed Question!)
  {
    id: "school-twin-q13",
    questionNumber: 13,
    sourceType: "twin_practice",
    patternGroup: 4,
    patternTitle: "Pattern #4 Twin: Relationship Between Ten Thousands and Hundreds",
    teks: "3.2B",
    prompt:
      "What is the relationship between the ten thousands place and the hundreds place in the number shown?\n\n362,615",
    visualType: "place_value_number",
    highlightedNumber: "362,615",
    options: [
      {
        id: "A",
        text: "The ten thousands place is two times greater than the hundreds place.",
      },
      {
        id: "B",
        text: "The ten thousands place is ten times greater than the hundreds place.",
      },
      {
        id: "C",
        text: "The ten thousands place is one hundred times greater than the hundreds place.",
      },
      {
        id: "D",
        text: "The ten thousands place is six hundred times greater than the hundreds place.",
      },
    ],
    correctAnswer: "C",
    guidedSteps: [
      {
        stepNumber: 1,
        label: "What is the value of the digit in the ten thousands place?",
        placeholder: "Sample: 40,000",
        expectedValue: "60,000",
        acceptableValues: ["60,000", "60000"],
        helperText: "Check the Ten Thousands column on the place-value chart.",
      },
      {
        stepNumber: 2,
        label: "What is the value of the digit in the hundreds place?",
        placeholder: "Sample: 400",
        expectedValue: "600",
        helperText: "Check the Hundreds column on the place-value chart.",
      },
      {
        stepNumber: 3,
        label: "Multiply ×10 for each jump from Hundreds to Ten Thousands:",
        placeholder: "Sample: 1,000",
        expectedValue: "100",
        helperText: "Count the jumps from Hundreds to Ten Thousands and multiply 10 for each jump.",
      },
    ],
    teacherFeedbackOnMistake:
      "Never pick 'two times greater' for 2 place value jumps! 2 jumps means 10 × 10 = 100 times greater!",
    workedExplanation:
      "From the hundreds place (600) to the thousands place is ×10, and from the thousands place to the ten thousands place (60,000) is another ×10. 10 × 10 = 100 times greater (Choice C).",
  },

  // Twin of Q5 (Pattern #5: Base-10 Block Models - Extra Practice for Missed Question!)
  {
    id: "school-twin-q14",
    questionNumber: 14,
    sourceType: "twin_practice",
    patternGroup: 5,
    patternTitle: "Pattern #5 Twin: Comparing 3 Student Base-10 Block Models",
    teks: "3.2A",
    prompt:
      "Three students made models to represent numbers. The models are shown:\n\n• Liam: 1 hundred flat, 2 ten rods, and 10 unit ones\n• Noah: 13 ten rods\n• Emma: 1 hundred flat and 3 unit ones\n\nWhich models represent the same number?",
    visualType: "base10_models",
    base10Models: [
      { name: "Liam", hundreds: 1, tens: 2, ones: 10 },
      { name: "Noah", hundreds: 0, tens: 13, ones: 0 },
      { name: "Emma", hundreds: 1, tens: 0, ones: 3 },
    ],
    options: [
      {
        id: "A",
        text: "Liam's model and Emma's model, because 1 hundred, 2 tens, and 10 ones is equivalent to 1 hundred and 3 ones.",
      },
      {
        id: "B",
        text: "Liam's model and Noah's model, because 1 hundred, 2 tens, and 10 ones is equivalent to 13 tens.",
      },
      {
        id: "C",
        text: "Noah's model and Emma's model, because 13 tens is equivalent to 1 hundred and 3 ones.",
      },
      {
        id: "D",
        text: "None of the models.",
      },
    ],
    correctAnswer: "B",
    guidedSteps: [
      {
        stepNumber: 1,
        label: "Find the total value of Liam's model (1 hundred + 2 tens + 10 ones):",
        placeholder: "Sample: 150",
        expectedValue: "130",
        helperText: "Add the hundred flat, ten rods, and unit ones together.",
      },
      {
        stepNumber: 2,
        label: "Find the total value of Noah's model (13 tens = 13 × 10):",
        placeholder: "Sample: 150",
        expectedValue: "130",
        helperText: "Multiply the number of ten rods by 10.",
      },
      {
        stepNumber: 3,
        label: "Find the total value of Emma's model (1 hundred + 3 ones):",
        placeholder: "Sample: 105",
        expectedValue: "103",
        helperText: "Add the hundred flat and the unit ones (remember 0 tens).",
      },
    ],
    teacherFeedbackOnMistake:
      "Write the total value for each student first: Liam = 130, Noah = 130, Emma = 103.",
    workedExplanation:
      "Liam's model = 100 + 20 + 10 = 130. Noah's model = 13 × 10 = 130. Emma's model = 100 + 3 = 103. Liam and Noah both represent 130 (Choice B).",
  },

  // Twin of Q6 (Pattern #6: Base-10 Regrouping Tens to Hundreds)
  {
    id: "school-twin-q15",
    questionNumber: 15,
    sourceType: "twin_practice",
    patternGroup: 6,
    patternTitle: "Pattern #6 Twin: Regrouping 30 Tens into 3 Hundreds",
    teks: "3.2A",
    prompt:
      "Which of these models represent the same number?\n\n• Model X: 30 unit ones\n• Model Y: 30 ten rods\n• Model Z: 3 hundred flats",
    visualType: "base10_models",
    base10Models: [
      { name: "Model X", hundreds: 0, tens: 0, ones: 30 },
      { name: "Model Y", hundreds: 0, tens: 30, ones: 0 },
      { name: "Model Z", hundreds: 3, tens: 0, ones: 0 },
    ],
    options: [
      {
        id: "A",
        text: "Model X and Model Y, because 30 ones is equivalent to 30 tens.",
      },
      {
        id: "B",
        text: "Model X and Model Z, because 30 ones is equivalent to 3 hundreds.",
      },
      {
        id: "C",
        text: "Model Y and Model Z, because 30 tens is equivalent to 3 hundreds.",
      },
      {
        id: "D",
        text: "None of these.",
      },
    ],
    correctAnswer: "C",
    guidedSteps: [
      {
        stepNumber: 1,
        label: "What is the value of Model X (30 ones)?",
        placeholder: "Sample: 50",
        expectedValue: "30",
        helperText: "Each unit cube is worth 1.",
      },
      {
        stepNumber: 2,
        label: "What is the value of Model Y (30 tens) and Model Z (3 hundreds)?",
        placeholder: "Sample: 500",
        expectedValue: "300",
        helperText: "Multiply 30 × 10 for Model Y and 3 × 100 for Model Z.",
      },
    ],
    teacherFeedbackOnMistake:
      "10 tens make 1 hundred, so 30 tens make 3 hundreds (300).",
    workedExplanation:
      "Model X = 30, Model Y = 300, and Model Z = 300. Model Y and Model Z both represent 300 (Choice C).",
  },

  // Twin of Q7 (Pattern #7: 3-Factor Multiplication Equation - Extra Practice for Missed Question!)
  {
    id: "school-twin-q16",
    questionNumber: 16,
    sourceType: "twin_practice",
    patternGroup: 7,
    patternTitle: "Pattern #7 Twin: Three-Number Equal Groups Equation (3 × 2 × 8)",
    teks: "3.4K",
    prompt:
      "An elementary school has 3 third-grade classrooms. There are 2 bookshelves in each classroom. Each bookshelf holds 8 bins of math manipulatives.\n\nComplete the equation to represent the total number of bins in the third-grade classrooms.\n\nOperator Bank: (A) +   (B) −   (C) ×   (D) ÷\n\n3  [ Box 1 ]  2  [ Box 2 ]  8  =  □",
    visualType: "equation_boxes",
    options: [
      { id: "A", text: "3 + 2 × 8 = □   (Box 1 is A: +, Box 2 is C: ×)" },
      { id: "B", text: "3 ÷ 2 × 8 = □   (Box 1 is D: ÷, Box 2 is C: ×)" },
      { id: "C", text: "3 × 2 × 8 = □   (Both boxes use C: ×)" },
      { id: "D", text: "3 × 2 + 8 = □   (Box 1 is C: ×, Box 2 is A: +)" },
    ],
    correctAnswer: "C",
    guidedSteps: [
      {
        stepNumber: 1,
        label: "Step 1: 3 classrooms with 2 bookshelves in EACH classroom. How many bookshelves total?",
        placeholder: "Sample: 10",
        expectedValue: "6",
        helperText: "Multiply the number of classrooms by the bookshelves in each classroom.",
      },
      {
        stepNumber: 2,
        label: "Step 2: Multiply the total bookshelves by 8 bins on each bookshelf:",
        placeholder: "Sample: 40",
        expectedValue: "48",
        helperText: "Multiply your Step 1 answer by 8 to find the total number of bins.",
      },
    ],
    teacherFeedbackOnMistake:
      "When you see '2 in EACH classroom' and '8 on EACH bookshelf', both steps are equal groups, so BOTH boxes use ×!",
    workedExplanation:
      "First multiply 3 classrooms × 2 bookshelves = 6 bookshelves. Then multiply 6 bookshelves × 8 bins = 48 bins. The equation is 3 × 2 × 8 = □ (Choice C).",
  },

  // Twin of Q8 (Pattern #8: Input-Output Table Rule Sentence - Extra Practice for Missed Question!)
  {
    id: "school-twin-q17",
    questionNumber: 17,
    sourceType: "twin_practice",
    patternGroup: 8,
    patternTitle: "Pattern #8 Twin: Describing Input-Output Table Rules (×6)",
    teks: "3.5E",
    prompt:
      "Marcus swims 6 laps every day at swim practice. The table shows the total number of laps Marcus swims over time.\n\nComplete the sentence to describe the relationship in the table:\n\nThe number of days [ (A) plus | (B) minus | (C) times | (D) divided by ] [ (A) 3 | (B) 6 | (C) 15 | (D) 18 ] is equal to the number of laps Marcus swims.",
    visualType: "single_table",
    tableData: {
      title: "Marcus's Swim Laps",
      headers: ["Number of Days", "Laps Swum"],
      rows: [
        [3, 18],
        [5, 30],
        [7, 42],
      ],
    },
    options: [
      {
        id: "A",
        text: "The number of days plus (A) 15 (C) is equal to the number of laps.",
      },
      {
        id: "B",
        text: "The number of days times (C) 3 (A) is equal to the number of laps.",
      },
      {
        id: "C",
        text: "The number of days times (C) 6 (B) is equal to the number of laps.",
      },
      {
        id: "D",
        text: "The number of days divided by (D) 6 (B) is equal to the number of laps.",
      },
    ],
    correctAnswer: "C",
    guidedSteps: [
      {
        stepNumber: 1,
        label: "Look at Row 1: 3 days → 18 laps. What number do you multiply 3 by to get 18?",
        placeholder: "Sample: 4",
        expectedValue: "6",
        helperText: "Ask yourself: 3 × ? = 18.",
      },
      {
        stepNumber: 2,
        label: "Check Row 2 (5 days → 30) and Row 3 (7 days → 42). Write the operation and number:",
        placeholder: "Sample: times 4",
        expectedValue: "times 6",
        acceptableValues: ["times 6", "x 6", "× 6", "6", "*6"],
        helperText: "Check if multiplying every day count by your Step 1 number gives the laps column.",
      },
    ],
    teacherFeedbackOnMistake:
      "Write ×6 between the columns for every row: 3 × 6 = 18, 5 × 6 = 30, 7 × 6 = 42.",
    workedExplanation:
      "In every row, multiplying the number of days by 6 equals the number of laps (3 × 6 = 18, 5 × 6 = 30, 7 × 6 = 42). So the number of days times (C) 6 (B) equals the number of laps.",
  },

  // Twin of Q9 (Pattern #9: Matching Story to Table)
  {
    id: "school-twin-q18",
    questionNumber: 18,
    sourceType: "twin_practice",
    patternGroup: 9,
    patternTitle: "Pattern #9 Twin: Matching Equal Groups Rule to the Correct Table (×7)",
    teks: "3.5E",
    prompt:
      "There are 7 granola bars in each box at a grocery store. Which table shows the relationship between the number of boxes and the number of granola bars?",
    visualType: "four_tables",
    fourTables: [
      {
        id: "A",
        title: "Table A",
        headers: ["Number of Boxes", "Number of Bars"],
        rows: [
          [2, 9],
          [3, 10],
          [4, 11],
          [5, 12],
        ],
      },
      {
        id: "B",
        title: "Table B",
        headers: ["Number of Boxes", "Number of Bars"],
        rows: [
          [2, 7],
          [3, 14],
          [4, 21],
          [5, 28],
        ],
      },
      {
        id: "C",
        title: "Table C",
        headers: ["Number of Boxes", "Number of Bars"],
        rows: [
          [2, 14],
          [3, 21],
          [4, 28],
          [5, 35],
        ],
      },
      {
        id: "D",
        title: "Table D",
        headers: ["Number of Boxes", "Number of Bars"],
        rows: [
          [2, 14],
          [3, 28],
          [4, 56],
          [5, 112],
        ],
      },
    ],
    options: [
      { id: "A", text: "Table A (2→9, 3→10, 4→11, 5→12)" },
      { id: "B", text: "Table B (2→7, 3→14, 4→21, 5→28)" },
      { id: "C", text: "Table C (2→14, 3→21, 4→28, 5→35)" },
      { id: "D", text: "Table D (2→14, 3→28, 4→56, 5→112)" },
    ],
    correctAnswer: "C",
    guidedSteps: [
      {
        stepNumber: 1,
        label: "How many granola bars are in 2 boxes (2 × 7)?",
        placeholder: "Sample: 12",
        expectedValue: "14",
        helperText: "Multiply 2 boxes by 7 bars per box.",
      },
      {
        stepNumber: 2,
        label: "How many granola bars are in 3 boxes (3 × 7)?",
        placeholder: "Sample: 18",
        expectedValue: "21",
        acceptableValues: ["21", "21 and 35", "35"],
        helperText: "Multiply 3 × 7, 4 × 7, and 5 × 7, then find the table that matches all four rows.",
      },
    ],
    teacherFeedbackOnMistake:
      "Multiply each box count by 7: 2×7=14, 3×7=21, 4×7=28, 5×7=35.",
    workedExplanation:
      "Multiply the number of boxes by 7: 2 × 7 = 14, 3 × 7 = 21, 4 × 7 = 28, 5 × 7 = 35. Table C shows this exact relationship.",
  },
];
