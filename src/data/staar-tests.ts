// src/data/staar-tests.ts
// Texas Education Agency (TEA) STAAR Released Test Bank for Grade 3

export interface STAARQuestionOption {
  id: string; // A, B, C, D or F, G, H, J
  text: string;
}

export interface STAARRationale {
  correctRationale: string;
  distractorRationales?: Record<string, string>;
}

export interface STAARQuestion {
  id: string;
  questionNumber: number;
  year: string;
  grade: number;
  subject: string;
  reportingCategory: 1 | 2 | 3 | 4;
  reportingCategoryTitle: string;
  teks: string;
  teksDescription: string;
  isReadiness: boolean;
  prompt: string;
  options: STAARQuestionOption[];
  isGriddable: boolean;
  correctAnswer: string;
  hint: string;
  audioPrompt: string;
  teaRationale: STAARRationale;
}

export interface STAARTest {
  id: string;
  title: string;
  year: string;
  grade: number;
  subject: string;
  totalQuestions: number;
  timeLimitMinutes: number;
  passingScorePercent: number; // 55% Approaches
  meetsScorePercent: number;    // 70% Meets
  mastersScorePercent: number;  // 85% Masters
  reportingCategories: {
    category: 1 | 2 | 3 | 4;
    title: string;
    description: string;
    questionCount: number;
  }[];
  questions: STAARQuestion[];
}

export const STAAR_REPORTING_CATEGORIES = [
  {
    category: 1 as const,
    title: "Numerical Representations and Relationships",
    description: "Place value, comparing numbers to 100,000, fraction models, and equivalent fractions.",
  },
  {
    category: 2 as const,
    title: "Computations and Algebraic Relationships",
    description: "Addition, subtraction, multiplication, division, strip diagrams, and input-output tables.",
  },
  {
    category: 3 as const,
    title: "Geometry and Measurement",
    description: "2D/3D shapes, attributes, area models, perimeter, and liquid capacity/time.",
  },
  {
    category: 4 as const,
    title: "Data Analysis and Personal Financial Literacy",
    description: "Dot plots, pictographs, bar graphs, labor, income, and scarcity/cost.",
  }
];

export const STAAR_2022_GRADE3_MATH: STAARTest = {
  id: "staar-2022-grade3-math",
  title: "2022 STAAR Grade 3 Mathematics Released Exam",
  year: "2022",
  grade: 3,
  subject: "Mathematics",
  totalQuestions: 32,
  timeLimitMinutes: 60,
  passingScorePercent: 55,
  meetsScorePercent: 70,
  mastersScorePercent: 85,
  reportingCategories: [
    {
      category: 1,
      title: "Numerical Representations and Relationships",
      description: "Place value, fraction models, comparing and ordering numbers.",
      questionCount: 8
    },
    {
      category: 2,
      title: "Computations and Algebraic Relationships",
      description: "Whole number operations, comparison multiplication, equations, and tables.",
      questionCount: 13
    },
    {
      category: 3,
      title: "Geometry and Measurement",
      description: "2D/3D shapes, classifying polygons, area, and perimeter.",
      questionCount: 7
    },
    {
      category: 4,
      title: "Data Analysis and Personal Financial Literacy",
      description: "Dot plots, pictographs, labor, income, and resources.",
      questionCount: 4
    }
  ],
  questions: [
  {
    "id": "staar-2022-m-q01",
    "questionNumber": 1,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 1,
    "reportingCategoryTitle": "Numerical Representations and Relationships",
    "teks": "3.2D",
    "teksDescription": "Compare and order whole numbers up to 100,000 and represent comparisons using the symbols >, <, or =",
    "isReadiness": true,
    "prompt": "Which comparison is true?",
    "options": [
      {
        "id": "A",
        "text": "68 > 649"
      },
      {
        "id": "B",
        "text": "571 > 582"
      },
      {
        "id": "C",
        "text": "730 < 806"
      },
      {
        "id": "D",
        "text": "709 < 692"
      }
    ],
    "isGriddable": false,
    "correctAnswer": "C",
    "hint": "Compare the hundreds digits first. 7 hundreds is less than 8 hundreds (700 < 800).",
    "audioPrompt": "Which comparison is true? A: 68 is greater than 649. B: 571 is greater than 582. C: 730 is less than 806. D: 709 is less than 692.",
    "teaRationale": {
      "correctRationale": "Option C is correct. To determine which statement is true, compare the digits in the hundreds place: 7 in 730 is less than 8 in 806, so 730 < 806 is true.",
      "distractorRationales": {
        "A": "Option A is incorrect. The student likely confused the greater-than symbol (>) with the less-than symbol (<). 68 has only 2 digits, while 649 has 3 digits.",
        "B": "Option B is incorrect. Both numbers have 5 in the hundreds place, but in the tens place, 7 tens (70) is less than 8 tens (80), so 571 is less than 582.",
        "D": "Option D is incorrect. In the hundreds place, 7 hundreds is greater than 6 hundreds, so 709 is greater than 692, not less."
      }
    }
  },
  {
    "id": "staar-2022-m-q02",
    "questionNumber": 2,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 2,
    "reportingCategoryTitle": "Computations and Algebraic Relationships",
    "teks": "3.5C",
    "teksDescription": "Describe multiplication as a comparison such as 3 x 24 represents 3 times as much as 24",
    "isReadiness": false,
    "prompt": "Haruko did 9 sit-ups in P.E. class. The number of sit-ups Tom did can be represented by this expression:\n\n2 \u00d7 9\n\nWhich statement is true?",
    "options": [
      {
        "id": "F",
        "text": "Tom did 2 times as many sit-ups as Haruko."
      },
      {
        "id": "G",
        "text": "Haruko did 2 times as many sit-ups as Tom."
      },
      {
        "id": "H",
        "text": "Tom did 2 more sit-ups than Haruko."
      },
      {
        "id": "J",
        "text": "Haruko did 2 more sit-ups than Tom."
      }
    ],
    "isGriddable": false,
    "correctAnswer": "F",
    "hint": "The multiplication symbol \u00d7 means 'times as many'. Tom's sit-ups are 2 \u00d7 Haruko's sit-ups.",
    "audioPrompt": "Haruko did 9 sit-ups in P.E. class. The number of sit-ups Tom did can be represented by the expression 2 times 9. Which statement is true?",
    "teaRationale": {
      "correctRationale": "Option F is correct. The multiplication symbol (\u00d7) represents 'times as many.' Haruko did 9 sit-ups, and Tom did 2 \u00d7 9 sit-ups, indicating that Tom did 2 times as many sit-ups as Haruko.",
      "distractorRationales": {
        "G": "Option G is incorrect. The student likely reversed the numbers of sit-ups for Haruko and Tom. Tom did 2 \u00d7 9 = 18, which is more than Haruko's 9.",
        "H": "Option H is incorrect. The student confused words describing addition (+) ('more than') with words describing multiplication ('times as many'). '2 more than' would be 9 + 2 = 11.",
        "J": "Option J is incorrect. The student confused addition with multiplication AND reversed the subjects."
      }
    }
  },
  {
    "id": "staar-2022-m-q03",
    "questionNumber": 3,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 1,
    "reportingCategoryTitle": "Numerical Representations and Relationships",
    "teks": "3.3H",
    "teksDescription": "Compare two fractions having the same numerator or denominator using >, =, or < symbols and justify conclusions",
    "isReadiness": true,
    "prompt": "A student measured the lengths of two worms.\n\n\u2022 Worm S was 1/2 foot long.\n\u2022 Worm T was 2/2 foot long.\n\nWhich statement is true?",
    "options": [
      {
        "id": "A",
        "text": "The length of Worm S is greater than the length of Worm T."
      },
      {
        "id": "B",
        "text": "The length of Worm T is greater than the length of Worm S."
      },
      {
        "id": "C",
        "text": "The length of Worm S is equal to the length of Worm T."
      },
      {
        "id": "D",
        "text": "There is not enough information to compare the lengths of the worms."
      }
    ],
    "isGriddable": false,
    "correctAnswer": "B",
    "hint": "Both fractions have the same denominator (2). Compare the numerators: 2 is greater than 1, so 2/2 > 1/2.",
    "audioPrompt": "A student measured the lengths of two worms. Worm S was 1 half foot long. Worm T was 2 halves foot long. Which statement is true?",
    "teaRationale": {
      "correctRationale": "Option B is correct. Both fractions have the same denominator (2). Since 2 is greater than 1, 2/2 foot (1 whole foot) is greater than 1/2 foot.",
      "distractorRationales": {
        "A": "Option A is incorrect. The student confused greater than and less than.",
        "C": "Option C is incorrect. 1/2 and 2/2 are not equivalent (1/2 is half a foot; 2/2 is a whole foot).",
        "D": "Option D is incorrect. Because both measurements are given in feet with identical units, there is sufficient information."
      }
    }
  },
  {
    "id": "staar-2022-m-q04",
    "questionNumber": 4,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 4,
    "reportingCategoryTitle": "Data Analysis and Personal Financial Literacy",
    "teks": "3.9A",
    "teksDescription": "Explain the connection between human capital/labor and income",
    "isReadiness": false,
    "prompt": "Trey is describing his labor and income. Which statement could be a description of both labor and income for Trey?",
    "options": [
      {
        "id": "F",
        "text": "Trey does volunteer work at a hospital."
      },
      {
        "id": "G",
        "text": "Trey pays a company to repair his roof."
      },
      {
        "id": "H",
        "text": "Trey takes $25 out of his bank account and spends the money at a store."
      },
      {
        "id": "J",
        "text": "Trey takes dogs for a walk after school and earns $25."
      }
    ],
    "isGriddable": false,
    "correctAnswer": "J",
    "hint": "Labor means doing work. Income means money earned from that work.",
    "audioPrompt": "Trey is describing his labor and income. Which statement could be a description of both labor and income for Trey?",
    "teaRationale": {
      "correctRationale": "Option J is correct. 'Walking dogs' represents labor (work/service performed), and 'earns $25' represents income (money received for labor).",
      "distractorRationales": {
        "F": "Option F is incorrect. Volunteer work represents labor, but unpaid volunteer work produces no income.",
        "G": "Option G is incorrect. Paying for a roof repair represents an expenditure, not income.",
        "H": "Option H is incorrect. Withdrawing money from an existing bank account and spending it is an expenditure, not labor or income."
      }
    }
  },
  {
    "id": "staar-2022-m-q05",
    "questionNumber": 5,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 3,
    "reportingCategoryTitle": "Geometry and Measurement",
    "teks": "3.6C",
    "teksDescription": "Determine the area of rectangles with whole number side lengths in problems using multiplication",
    "isReadiness": true,
    "prompt": "The rectangular floor of Ms. Ragan\u2019s closet is completely covered with carpet squares. Each carpet square covers 1 square foot of the floor.\n\nThere are 4 rows, and each row has 16 carpet squares.\n\nWhat is the area of the floor of this closet in square feet?",
    "options": [],
    "isGriddable": true,
    "correctAnswer": "64",
    "hint": "Multiply the number of rows (4) by the number of square feet in each row (16): 4 \u00d7 16 = ?",
    "audioPrompt": "The rectangular floor of Ms. Ragan's closet is completely covered with carpet squares. There are 4 rows, and each row has 16 carpet squares. What is the area of the floor in square feet?",
    "teaRationale": {
      "correctRationale": "64 is correct. The dimensions of the floor are 4 rows by 16 squares. Area = 4 \u00d7 16 = 64 square feet.",
      "distractorRationales": {}
    }
  },
  {
    "id": "staar-2022-m-q06",
    "questionNumber": 6,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 4,
    "reportingCategoryTitle": "Data Analysis and Personal Financial Literacy",
    "teks": "3.8A",
    "teksDescription": "Summarize a data set with multiple categories using a frequency table, dot plot, pictograph, or bar graph with scaled intervals",
    "isReadiness": true,
    "prompt": "The numbers listed show the speed in miles per hour Henry pitched a baseball:\n\n30, 32, 38, 30, 33, 34, 32, 35, 38, 36, 35, 32, 30, 32, 35\n\nWhich dot plot represents the speed of Henry\u2019s pitches?",
    "options": [
      {
        "id": "F",
        "text": "Dot plot with 30 (2 dots), 32 (3 dots), 33 (1 dot), 34 (1 dot), 35 (3 dots), 36 (1 dot), 38 (2 dots)"
      },
      {
        "id": "G",
        "text": "Dot plot with 30 (3 dots), 32 (4 dots), 33 (1 dot), 34 (1 dot), 35 (3 dots), 36 (1 dot), 38 (2 dots)"
      },
      {
        "id": "H",
        "text": "Dot plot with 30 (3 dots), 32 (3 dots), 33 (2 dots), 34 (1 dot), 35 (3 dots), 36 (1 dot), 38 (2 dots)"
      },
      {
        "id": "J",
        "text": "Dot plot with 30 (3 dots), 32 (4 dots), 33 (1 dot), 34 (2 dots), 35 (2 dots), 36 (1 dot), 38 (1 dot)"
      }
    ],
    "isGriddable": false,
    "correctAnswer": "G",
    "hint": "Count how many times each number appears. 30 appears 3 times. 32 appears 4 times. 35 appears 3 times.",
    "audioPrompt": "The numbers listed show the speed in miles per hour Henry pitched a baseball. Which dot plot represents the speed of Henry's pitches?",
    "teaRationale": {
      "correctRationale": "Option G is correct. Counting the occurrences of each speed: 30 appears 3 times (3 dots), 32 appears 4 times (4 dots), 33 appears 1 time (1 dot), 34 appears 1 time (1 dot), 35 appears 3 times (3 dots), 36 appears 1 time (1 dot), and 38 appears 2 times (2 dots).",
      "distractorRationales": {
        "F": "Option F is incorrect. 30 has only 2 dots instead of 3, and 32 has only 3 dots instead of 4.",
        "H": "Option H is incorrect. 32 has 3 dots instead of 4, and 33 has 2 dots instead of 1.",
        "J": "Option J is incorrect. 34 has 2 dots instead of 1, 35 has 2 dots instead of 3, and 38 has 1 dot instead of 2."
      }
    }
  },
  {
    "id": "staar-2022-m-q07",
    "questionNumber": 7,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 2,
    "reportingCategoryTitle": "Computations and Algebraic Relationships",
    "teks": "3.4E",
    "teksDescription": "Represent multiplication facts up to 10 x 10 using repeated addition, equal-sized groups, arrays, and area models",
    "isReadiness": false,
    "prompt": "Gia lists some different methods she thinks she can use to solve the multiplication problem shown:\n\n7 \u00d7 11 = ?\n\nWhich answer choice is NOT a correct method for Gia to use?",
    "options": [
      {
        "id": "A",
        "text": "An array model showing 7 rows with 11 items in each row."
      },
      {
        "id": "B",
        "text": "A number line with 7 jumps of 11 units starting at 0 and landing at 77."
      },
      {
        "id": "C",
        "text": "Skip counting by elevens: 11, 22, 33, 44, 55, 66, 77."
      },
      {
        "id": "D",
        "text": "Adding 11 starting from 7: 7, 18, 29, 40, 51, 62, 73."
      }
    ],
    "isGriddable": false,
    "correctAnswer": "D",
    "hint": "7 \u00d7 11 equals 77. Notice that sequence D ends at 73 because it starts at 7 instead of 11.",
    "audioPrompt": "Gia lists some different methods she thinks she can use to solve 7 times 11. Which answer choice is NOT a correct method for Gia to use?",
    "teaRationale": {
      "correctRationale": "Option D is correct (the incorrect method). Sequence D starts at 7 and repeatedly adds 11, ending at 73, which does not equal 7 \u00d7 11 = 77.",
      "distractorRationales": {
        "A": "Option A is a valid representation: an array with 7 rows of 11 counters equals 77.",
        "B": "Option B is a valid representation: 7 jumps of 11 on a number line lands on 77.",
        "C": "Option C is a valid representation: skip counting by 11 seven times produces 77."
      }
    }
  },
  {
    "id": "staar-2022-m-q08",
    "questionNumber": 8,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 3,
    "reportingCategoryTitle": "Geometry and Measurement",
    "teks": "3.6B",
    "teksDescription": "Use attributes to recognize rhombuses, parallelograms, trapezoids, rectangles, and squares as examples of quadrilaterals",
    "isReadiness": false,
    "prompt": "A group of figures is shown: each figure is a 4-sided polygon (quadrilateral) with at least one pair of parallel opposite sides, but non-equal adjacent sides and non-right angles.\n\nWhich word best describes all the figures in the group?",
    "options": [
      {
        "id": "F",
        "text": "Rectangle"
      },
      {
        "id": "G",
        "text": "Rhombus"
      },
      {
        "id": "H",
        "text": "Trapezoid"
      },
      {
        "id": "J",
        "text": "Parallelogram"
      }
    ],
    "isGriddable": false,
    "correctAnswer": "H",
    "hint": "A trapezoid is a quadrilateral with at least one pair of parallel sides.",
    "audioPrompt": "A group of figures is shown. Which word best describes all the figures in the group?",
    "teaRationale": {
      "correctRationale": "Option H is correct. In Texas mathematics, a trapezoid is defined as a quadrilateral with at least one pair of parallel sides. All figures shown have exactly one pair of parallel sides.",
      "distractorRationales": {
        "F": "Option F is incorrect. Rectangles must have four right angles.",
        "G": "Option G is incorrect. Rhombuses must have four sides of equal length.",
        "J": "Option J is incorrect. Parallelograms must have two pairs of parallel opposite sides."
      }
    }
  },
  {
    "id": "staar-2022-m-q09",
    "questionNumber": 9,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 2,
    "reportingCategoryTitle": "Computations and Algebraic Relationships",
    "teks": "3.5E",
    "teksDescription": "Represent real-world relationships using number pairs in a table and verbal descriptions",
    "isReadiness": true,
    "prompt": "The table shows the numbers of tomato plants and spinach plants in five different gardens:\n\nGarden K: 34 Tomato, 43 Spinach\nGarden L: 26 Tomato, 35 Spinach\nGarden M: 38 Tomato, 47 Spinach\nGarden N: 29 Tomato, 38 Spinach\nGarden P: 45 Tomato, 54 Spinach\n\nBased on the relationship shown in the table, which statement is true?",
    "options": [
      {
        "id": "A",
        "text": "There are 9 more spinach plants than tomato plants in each garden."
      },
      {
        "id": "B",
        "text": "There are 9 fewer spinach plants than tomato plants in each garden."
      },
      {
        "id": "C",
        "text": "There are 8 more spinach plants than tomato plants in each garden."
      },
      {
        "id": "D",
        "text": "There are 8 fewer spinach plants than tomato plants in each garden."
      }
    ],
    "isGriddable": false,
    "correctAnswer": "A",
    "hint": "Subtract the number of tomato plants from spinach plants: 43 - 34 = 9, 35 - 26 = 9. Spinach is 9 greater.",
    "audioPrompt": "The table shows the numbers of tomato plants and spinach plants in five different gardens. Based on the relationship shown in the table, which statement is true?",
    "teaRationale": {
      "correctRationale": "Option A is correct. In every garden, Spinach = Tomato + 9 (43 - 34 = 9, 35 - 26 = 9, 47 - 38 = 9, 38 - 29 = 9, 54 - 45 = 9).",
      "distractorRationales": {
        "B": "Option B is incorrect. The student reversed the relationship; there are 9 more spinach plants, not fewer.",
        "C": "Option C is incorrect. The student made a subtraction error thinking 43 - 34 was 8.",
        "D": "Option D is incorrect. Subtraction error combined with reversing the relationship."
      }
    }
  },
  {
    "id": "staar-2022-m-q10",
    "questionNumber": 10,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 1,
    "reportingCategoryTitle": "Numerical Representations and Relationships",
    "teks": "3.3D",
    "teksDescription": "Compose and decompose a fraction a/b with a numerator greater than zero and less than or equal to b as a sum of parts 1/b",
    "isReadiness": false,
    "prompt": "The picture shows 8 seats in a movie theater row. Children are sitting in 3 of the 8 seats.\n\nWhich expression is equivalent to the fraction of the seats that have children sitting in them?",
    "options": [
      {
        "id": "F",
        "text": "1/8 + 1/8 + 1/8 + 1/8 + 1/8 + 1/8 + 1/8 + 1/8"
      },
      {
        "id": "G",
        "text": "1/3 + 1/3 + 1/3"
      },
      {
        "id": "H",
        "text": "3/8 + 3/8 + 3/8 + 3/8 + 3/8 + 3/8 + 3/8 + 3/8"
      },
      {
        "id": "J",
        "text": "1/8 + 1/8 + 1/8"
      }
    ],
    "isGriddable": false,
    "correctAnswer": "J",
    "hint": "Each occupied seat is 1/8 of the row. There are 3 occupied seats, so add 1/8 three times.",
    "audioPrompt": "The picture shows 8 seats in a movie theater row. Children are sitting in 3 of the 8 seats. Which expression is equivalent to the fraction of the seats that have children sitting in them?",
    "teaRationale": {
      "correctRationale": "Option J is correct. Each seat represents 1/8 of the whole. Since children occupy 3 seats, the decomposed fraction is 1/8 + 1/8 + 1/8 = 3/8.",
      "distractorRationales": {
        "F": "Option F is incorrect. This expression sums to 8/8 (all 8 seats occupied).",
        "G": "Option G is incorrect. The denominator must be 8 (total seats), not 3.",
        "H": "Option H is incorrect. Adding 3/8 eight times equals 24/8 = 3 wholes."
      }
    }
  },
  {
    "id": "staar-2022-m-q11",
    "questionNumber": 11,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 2,
    "reportingCategoryTitle": "Computations and Algebraic Relationships",
    "teks": "3.4J",
    "teksDescription": "Determine a quotient using the relationship between multiplication and division",
    "isReadiness": false,
    "prompt": "Which number sentence can be used to find the number that goes in the box?\n\n12 \u00f7 2 = \u25a1",
    "options": [
      {
        "id": "A",
        "text": "2 + 12 = 14"
      },
      {
        "id": "B",
        "text": "6 \u00d7 2 = 12"
      },
      {
        "id": "C",
        "text": "12 \u00d7 2 = 24"
      },
      {
        "id": "D",
        "text": "2 + 10 = 12"
      }
    ],
    "isGriddable": false,
    "correctAnswer": "B",
    "hint": "Multiplication and division are inverse operations. Since 6 \u00d7 2 = 12, 12 \u00f7 2 = 6.",
    "audioPrompt": "Which number sentence can be used to find the number that goes in the box for 12 divided by 2 equals box?",
    "teaRationale": {
      "correctRationale": "Option B is correct. Multiplication and division are inverse operations (fact family: 6 \u00d7 2 = 12, 2 \u00d7 6 = 12, 12 \u00f7 2 = 6, 12 \u00f7 6 = 2).",
      "distractorRationales": {
        "A": "Option A is incorrect. Addition is not the inverse of division.",
        "C": "Option C is incorrect. 12 \u00d7 2 = 24 multiplies the dividend by the divisor instead of finding the missing factor.",
        "D": "Option D is incorrect. Addition does not solve division."
      }
    }
  },
  {
    "id": "staar-2022-m-q12",
    "questionNumber": 12,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 2,
    "reportingCategoryTitle": "Computations and Algebraic Relationships",
    "teks": "3.5B",
    "teksDescription": "Represent and solve one- and two-step multiplication and division problems within 100 using arrays, strip diagrams, and equations",
    "isReadiness": true,
    "prompt": "Janet has 2 new games.\n\n\u2022 Each game has 3 packs of cards.\n\u2022 Each pack has 10 cards.\n\nWhich model can be used to find the total number of cards Janet has for these 2 games?",
    "options": [
      {
        "id": "F",
        "text": "A strip diagram showing 6 sections of 10: [10][10][10][10][10][10]"
      },
      {
        "id": "G",
        "text": "A strip diagram showing 6 sections of 3: [3][3][3][3][3][3]"
      },
      {
        "id": "H",
        "text": "A strip diagram showing 2 sections of 3 and 10: [3][10][3][10]"
      },
      {
        "id": "J",
        "text": "A strip diagram showing 2 sections of 10: [10][10]"
      }
    ],
    "isGriddable": false,
    "correctAnswer": "F",
    "hint": "Find the total number of packs first: 2 games \u00d7 3 packs = 6 packs. Each pack has 10 cards, so 6 groups of 10.",
    "audioPrompt": "Janet has 2 new games. Each game has 3 packs of cards. Each pack has 10 cards. Which model can be used to find the total number of cards Janet has?",
    "teaRationale": {
      "correctRationale": "Option F is correct. 2 games with 3 packs each equals 2 \u00d7 3 = 6 packs. With 10 cards in each pack, the total is represented by 6 equal groups of 10 (total 60).",
      "distractorRationales": {
        "G": "Option G is incorrect. This represents 6 groups of 3 cards (18 cards).",
        "H": "Option H is incorrect. It adds 3 and 10 rather than multiplying.",
        "J": "Option J is incorrect. This only accounts for 2 packs of 10 (20 cards)."
      }
    }
  },
  {
    "id": "staar-2022-m-q13",
    "questionNumber": 13,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 3,
    "reportingCategoryTitle": "Geometry and Measurement",
    "teks": "3.6A",
    "teksDescription": "Classify and sort two- and three-dimensional figures, including cones, cylinders, spheres, triangular and rectangular prisms, and cubes, based on attributes",
    "isReadiness": true,
    "prompt": "Leighton made a table that correctly shows the attributes of shapes. She used a check mark (\u2713) to identify the attributes of each shape:\n\nWhich table correctly identifies whether each shape has vertices and is a quadrilateral?",
    "options": [
      {
        "id": "A",
        "text": "Cube: Vertices \u2713, Quad \u2713 | Cylinder: Vertices \u2713, Quad \u2717 | Rhombus: Vertices \u2713, Quad \u2713"
      },
      {
        "id": "B",
        "text": "Cube: Vertices \u2717, Quad \u2717 | Cylinder: Vertices \u2717, Quad \u2717 | Rhombus: Vertices \u2713, Quad \u2717"
      },
      {
        "id": "C",
        "text": "Cube: Vertices \u2713, Quad \u2717 | Cylinder: Vertices \u2717, Quad \u2717 | Rhombus: Vertices \u2713, Quad \u2713"
      },
      {
        "id": "D",
        "text": "Cube: Vertices \u2713, Quad \u2717 | Cylinder: Vertices \u2713, Quad \u2713 | Rhombus: Vertices \u2717, Quad \u2713"
      }
    ],
    "isGriddable": false,
    "correctAnswer": "C",
    "hint": "A cube is 3D with 8 vertices (not a 2D quadrilateral). A cylinder has curved surfaces and 0 vertices. A rhombus has 4 vertices and is a 4-sided quadrilateral.",
    "audioPrompt": "Leighton made a table that correctly shows the attributes of shapes. Which table correctly identifies whether each shape has vertices and is a quadrilateral?",
    "teaRationale": {
      "correctRationale": "Option C is correct. A cube has 8 vertices but is a 3D prism, not a 2D quadrilateral. A cylinder has 0 vertices and is not a quadrilateral. A rhombus has 4 vertices and is a 4-sided 2D quadrilateral.",
      "distractorRationales": {
        "A": "Option A is incorrect. A cube is 3D, not a 2D quadrilateral.",
        "B": "Option B is incorrect. A cube has 8 vertices, and a rhombus is a quadrilateral.",
        "D": "Option D is incorrect. A cylinder has no vertices and is not a quadrilateral."
      }
    }
  },
  {
    "id": "staar-2022-m-q14",
    "questionNumber": 14,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 2,
    "reportingCategoryTitle": "Computations and Algebraic Relationships",
    "teks": "3.4K",
    "teksDescription": "Solve one-step and two-step problems involving multiplication and division within 100",
    "isReadiness": true,
    "prompt": "A group of people bought tickets for a roller-coaster ride.\n\n\u2022 The group spent $4 for each ticket.\n\u2022 Altogether the group spent $48 on tickets.\n\u2022 Each person in the group got 2 tickets.\n\nHow many people were in the group?",
    "options": [],
    "isGriddable": true,
    "correctAnswer": "6",
    "hint": "Step 1: Find total tickets bought: $48 \u00f7 $4 = 12 tickets. Step 2: Since each person got 2 tickets: 12 \u00f7 2 = ?",
    "audioPrompt": "A group of people spent 4 dollars for each ticket and spent 48 dollars altogether. Each person got 2 tickets. How many people were in the group?",
    "teaRationale": {
      "correctRationale": "6 is correct. Step 1: Total tickets = $48 \u00f7 $4 = 12 tickets. Step 2: People = 12 tickets \u00f7 2 tickets per person = 6 people.",
      "distractorRationales": {}
    }
  },
  {
    "id": "staar-2022-m-q15",
    "questionNumber": 15,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 1,
    "reportingCategoryTitle": "Numerical Representations and Relationships",
    "teks": "3.3E",
    "teksDescription": "Solve problems involving partitioning an object or a set of objects among two or more recipients using pictorial representations of fractions",
    "isReadiness": false,
    "prompt": "Carter and Dane shared a package of 8 baseballs equally.\n\nWhat fraction of the package of baseballs did each person get?",
    "options": [
      {
        "id": "A",
        "text": "2/8"
      },
      {
        "id": "B",
        "text": "4/4"
      },
      {
        "id": "C",
        "text": "4/1"
      },
      {
        "id": "D",
        "text": "4/8"
      }
    ],
    "isGriddable": false,
    "correctAnswer": "D",
    "hint": "Divide 8 baseballs equally between 2 people: 8 \u00f7 2 = 4 baseballs. Out of the 8 total, that is 4/8.",
    "audioPrompt": "Carter and Dane shared a package of 8 baseballs equally. What fraction of the package of baseballs did each person get?",
    "teaRationale": {
      "correctRationale": "Option D is correct. 8 baseballs divided equally between 2 people gives 4 baseballs each. Since the whole package has 8 baseballs, each person gets 4/8 of the package.",
      "distractorRationales": {
        "A": "Option A is incorrect. The student used the 2 people as the numerator rather than the 4 baseballs received.",
        "B": "Option B is incorrect. 4/4 equals 1 whole package.",
        "C": "Option C is incorrect. 4/1 represents 4 whole packages."
      }
    }
  },
  {
    "id": "staar-2022-m-q16",
    "questionNumber": 16,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 3,
    "reportingCategoryTitle": "Geometry and Measurement",
    "teks": "3.7B",
    "teksDescription": "Determine the perimeter of a polygon or a missing length when given perimeter and remaining side lengths",
    "isReadiness": true,
    "prompt": "Each side of this equilateral octagon (8-sided polygon) is the same length. The perimeter of the figure is 72 inches.\n\nWhat is the length of one side of the figure in inches?",
    "options": [
      {
        "id": "F",
        "text": "8 in."
      },
      {
        "id": "G",
        "text": "12 in."
      },
      {
        "id": "H",
        "text": "9 in."
      },
      {
        "id": "J",
        "text": "18 in."
      }
    ],
    "isGriddable": false,
    "correctAnswer": "H",
    "hint": "An octagon has 8 equal sides. Perimeter is the total distance around. Divide: 72 \u00f7 8 = ?",
    "audioPrompt": "Each side of an 8-sided figure is the same length. The perimeter is 72 inches. What is the length of one side in inches?",
    "teaRationale": {
      "correctRationale": "Option H is correct. An octagon has 8 sides of equal length. Since the total perimeter is 72 inches: Side length = 72 \u00f7 8 = 9 inches.",
      "distractorRationales": {
        "F": "Option F is incorrect. 8 is the number of sides, not the length of each side.",
        "G": "Option G is incorrect. The student divided 72 by 6 instead of 8.",
        "J": "Option J is incorrect. The student divided 72 by 4 instead of 8."
      }
    }
  },
  {
    "id": "staar-2022-m-q17",
    "questionNumber": 17,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 2,
    "reportingCategoryTitle": "Computations and Algebraic Relationships",
    "teks": "3.4A",
    "teksDescription": "Solve with fluency one-step and two-step problems involving addition and subtraction within 1,000",
    "isReadiness": true,
    "prompt": "A movie theater has 710 seats.\n\n\u2022 158 seats are red.\n\u2022 247 seats are black.\n\u2022 119 seats are yellow.\n\u2022 The rest of the seats are green.\n\nHow many seats are green?",
    "options": [
      {
        "id": "A",
        "text": "186"
      },
      {
        "id": "B",
        "text": "524"
      },
      {
        "id": "C",
        "text": "214"
      },
      {
        "id": "D",
        "text": "206"
      }
    ],
    "isGriddable": false,
    "correctAnswer": "A",
    "hint": "Add the red, black, and yellow seats together: 158 + 247 + 119 = 524. Then subtract from 710.",
    "audioPrompt": "A movie theater has 710 seats. 158 seats are red, 247 seats are black, and 119 seats are yellow. The rest are green. How many seats are green?",
    "teaRationale": {
      "correctRationale": "Option A is correct. Sum of non-green seats = 158 + 247 + 119 = 524. Green seats = 710 - 524 = 186.",
      "distractorRationales": {
        "B": "Option B is incorrect. 524 is the sum of red, black, and yellow seats, not the remaining green seats.",
        "C": "Option C is incorrect. The student made a regrouping error when subtracting 710 - 524.",
        "D": "Option D is incorrect. Calculation error in addition or subtraction."
      }
    }
  },
  {
    "id": "staar-2022-m-q18",
    "questionNumber": 18,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 3,
    "reportingCategoryTitle": "Geometry and Measurement",
    "teks": "3.6C",
    "teksDescription": "Determine the area of rectangles with whole number side lengths in problems using multiplication",
    "isReadiness": true,
    "prompt": "Ms. Gonz\u00e1lez is putting square stickers on a rectangular poster. Each sticker has an area of 1 square inch.\n\nThe poster has 7 rows, and each row fits 8 stickers.\n\nWhat is the area of the entire poster in square inches?",
    "options": [
      {
        "id": "F",
        "text": "56"
      },
      {
        "id": "G",
        "text": "42"
      },
      {
        "id": "H",
        "text": "48"
      },
      {
        "id": "J",
        "text": "15"
      }
    ],
    "isGriddable": false,
    "correctAnswer": "F",
    "hint": "Multiply the number of rows (7) by the number of square stickers in each row (8): 7 \u00d7 8 = ?",
    "audioPrompt": "Ms. Gonz\u00e1lez is putting square stickers on a rectangular poster. There are 7 rows and 8 stickers in each row. What is the area of the entire poster in square inches?",
    "teaRationale": {
      "correctRationale": "Option F is correct. Area = rows \u00d7 columns = 7 \u00d7 8 = 56 square inches.",
      "distractorRationales": {
        "G": "Option G is incorrect. 7 \u00d7 6 = 42 (miscounted the width as 6 instead of 8).",
        "H": "Option H is incorrect. 6 \u00d7 8 = 48 (miscounted the height as 6 instead of 7).",
        "J": "Option J is incorrect. The student added 7 + 8 = 15 instead of multiplying."
      }
    }
  },
  {
    "id": "staar-2022-m-q19",
    "questionNumber": 19,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 1,
    "reportingCategoryTitle": "Numerical Representations and Relationships",
    "teks": "3.2D",
    "teksDescription": "Compare and order whole numbers up to 100,000",
    "isReadiness": true,
    "prompt": "Four students with number cards want to line up from left to right in order from least to greatest number:\n\n\u2022 Rico: 98,087\n\u2022 Olivia: 98,300\n\u2022 Penelope: 90,096\n\u2022 Erin: 9,975\n\nWhich statement is true?",
    "options": [
      {
        "id": "A",
        "text": "Olivia should be between Erin and Rico."
      },
      {
        "id": "B",
        "text": "Erin should be on the right end after Olivia."
      },
      {
        "id": "C",
        "text": "Penelope should be between Erin and Rico."
      },
      {
        "id": "D",
        "text": "All the students are in the correct order."
      }
    ],
    "isGriddable": false,
    "correctAnswer": "C",
    "hint": "Order the numbers from least to greatest: 9,975 (Erin) < 90,096 (Penelope) < 98,087 (Rico) < 98,300 (Olivia).",
    "audioPrompt": "Four students with number cards want to line up from least to greatest number. Which statement is true?",
    "teaRationale": {
      "correctRationale": "Option C is correct. The correct order from least to greatest is Erin (9,975), Penelope (90,096), Rico (98,087), and Olivia (98,300). Penelope is between Erin and Rico.",
      "distractorRationales": {
        "A": "Option A is incorrect. Olivia (98,300) is the greatest, so she belongs at the right end, not between Erin and Rico.",
        "B": "Option B is incorrect. Erin (9,975) is the smallest number (4 digits), so she belongs on the left end.",
        "D": "Option D is incorrect. The original order was not sorted from least to greatest."
      }
    }
  },
  {
    "id": "staar-2022-m-q20",
    "questionNumber": 20,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 4,
    "reportingCategoryTitle": "Data Analysis and Personal Financial Literacy",
    "teks": "3.9B",
    "teksDescription": "Describe how the availability or scarcity of resources impacts the cost of items",
    "isReadiness": false,
    "prompt": "Dahlia sold pineapples at a fruit stand. The table shows the number of pineapples available and the expected customers each week:\n\n\u2022 Week 1: 50 pineapples available, 110 expected customers\n\u2022 Week 2: 150 pineapples available, 150 expected customers\n\u2022 Week 3: 40 pineapples available, 200 expected customers\n\u2022 Week 4: 25 pineapples available, 50 expected customers\n\nIn which week did Dahlia most likely sell her pineapples for the highest price?",
    "options": [
      {
        "id": "F",
        "text": "Week 1, because the number of pineapples was greater than the expected customers."
      },
      {
        "id": "G",
        "text": "Week 2, because the number of pineapples was the same as the expected customers."
      },
      {
        "id": "H",
        "text": "Week 3, because fewer customers were expected to come to the fruit stand."
      },
      {
        "id": "J",
        "text": "Week 4, because the number of available pineapples was less than the expected customers."
      }
    ],
    "isGriddable": false,
    "correctAnswer": "J",
    "hint": "Scarcity raises prices: when supply is lower than customer demand, sellers can charge a higher price.",
    "audioPrompt": "In which week did Dahlia most likely sell her pineapples for the highest price?",
    "teaRationale": {
      "correctRationale": "Option J is correct. Prices are highest when items are scarce (supply is lower than demand). In Week 4, available pineapples (25) was lower than expected customers (50).",
      "distractorRationales": {
        "F": "Option F is incorrect. High supply and low demand leads to lower prices, not higher.",
        "G": "Option G is incorrect. Balanced supply and demand maintains normal equilibrium price.",
        "H": "Option H is incorrect. Week 3 had 200 expected customers, which was the highest customer demand."
      }
    }
  },
  {
    "id": "staar-2022-m-q21",
    "questionNumber": 21,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 2,
    "reportingCategoryTitle": "Computations and Algebraic Relationships",
    "teks": "3.5A",
    "teksDescription": "Represent one- and two-step problems involving addition and subtraction of whole numbers to 1,000 using strip diagrams",
    "isReadiness": true,
    "prompt": "The total number of keys on a computer keyboard is 87.\n\n\u2022 There are 26 letter keys and 21 special symbol keys on the keyboard.\n\u2022 The rest of the keys are function keys.\n\nWhich model represents one way to find the number of function keys on the keyboard?",
    "options": [
      {
        "id": "A",
        "text": "A number line starting at 87 with jumps of 26 and 21 to the right."
      },
      {
        "id": "B",
        "text": "A strip diagram with parts 26, 21, and ? on top, and total bar 87 at the bottom."
      },
      {
        "id": "C",
        "text": "A strip diagram showing 87, 26, and 21 all as parts of a larger unknown total."
      },
      {
        "id": "D",
        "text": "A bar showing parts 26 and 21 totaling 87."
      }
    ],
    "isGriddable": false,
    "correctAnswer": "B",
    "hint": "The whole keyboard is 87. The parts are 26 + 21 + ? = 87.",
    "audioPrompt": "The total number of keys on a keyboard is 87. There are 26 letter keys, 21 symbol keys, and the rest are function keys. Which model represents this?",
    "teaRationale": {
      "correctRationale": "Option B is correct. The total bar is 87 (whole), and the three component parts that compose 87 are 26 (letters), 21 (symbols), and ? (function keys).",
      "distractorRationales": {
        "A": "Option A is incorrect. Jumps to the right add to 87 instead of subtracting from 87.",
        "C": "Option C is incorrect. 87 is the whole, not an individual part.",
        "D": "Option D is incorrect. 26 + 21 = 47, which does not equal 87 without the missing part."
      }
    }
  },
  {
    "id": "staar-2022-m-q22",
    "questionNumber": 22,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 3,
    "reportingCategoryTitle": "Geometry and Measurement",
    "teks": "3.6A",
    "teksDescription": "Classify and sort three-dimensional figures, including cones, cylinders, spheres, prisms, and cubes",
    "isReadiness": true,
    "prompt": "Chris built a fort using prisms (3D figures with flat polygon faces and rectangular sides).\n\nWhich figure is NOT one Chris could have used to build his fort?",
    "options": [
      {
        "id": "F",
        "text": "Rectangular prism (shoebox shape)"
      },
      {
        "id": "G",
        "text": "Triangular prism (tent shape)"
      },
      {
        "id": "H",
        "text": "Cube (six square faces)"
      },
      {
        "id": "J",
        "text": "Cylinder (can shape with curved side and circular bases)"
      }
    ],
    "isGriddable": false,
    "correctAnswer": "J",
    "hint": "Prisms have flat polygon faces (rectangles, triangles, squares). Cylinders have curved surfaces and circular bases, so they are not prisms.",
    "audioPrompt": "Chris built a fort using prisms. Which figure is NOT one Chris could have used to build his fort?",
    "teaRationale": {
      "correctRationale": "Option J is correct. A cylinder has a curved surface and circular bases (not polygon bases), so it is not a prism.",
      "distractorRationales": {
        "F": "Option F is a prism: a rectangular prism has polygon faces.",
        "G": "Option G is a prism: a triangular prism has triangular bases and rectangular faces.",
        "H": "Option H is a prism: a cube is a special square rectangular prism."
      }
    }
  },
  {
    "id": "staar-2022-m-q23",
    "questionNumber": 23,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 2,
    "reportingCategoryTitle": "Computations and Algebraic Relationships",
    "teks": "3.5D",
    "teksDescription": "Determine the unknown whole number in a multiplication or division equation relating three whole numbers",
    "isReadiness": false,
    "prompt": "What number goes in the \u25a1 to make the equation true?\n\n\u25a1 \u00d7 7 = 98",
    "options": [
      {
        "id": "A",
        "text": "14"
      },
      {
        "id": "B",
        "text": "91"
      },
      {
        "id": "C",
        "text": "105"
      },
      {
        "id": "D",
        "text": "13"
      }
    ],
    "isGriddable": false,
    "correctAnswer": "A",
    "hint": "Use division to find the missing factor: 98 \u00f7 7 = ? (7 \u00d7 10 = 70, remaining 28 \u00f7 7 = 4, so 10 + 4 = 14).",
    "audioPrompt": "What number goes in the box to make the equation true: box times 7 equals 98?",
    "teaRationale": {
      "correctRationale": "Option A is correct. Divide 98 by 7: 98 \u00f7 7 = 14 (or check: 14 \u00d7 7 = (10 \u00d7 7) + (4 \u00d7 7) = 70 + 28 = 98).",
      "distractorRationales": {
        "B": "Option B is incorrect. The student subtracted 98 - 7 = 91 instead of dividing.",
        "C": "Option C is incorrect. The student added 98 + 7 = 105 instead of dividing.",
        "D": "Option D is incorrect. Division error: 13 \u00d7 7 = 91, not 98."
      }
    }
  },
  {
    "id": "staar-2022-m-q24",
    "year": "2022",
    "questionNumber": 24,
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 1,
    "reportingCategoryTitle": "Numerical Representations and Relationships",
    "teks": "3.2A",
    "teksDescription": "Compose and decompose numbers up to 100,000 as a sum of so many ten thousands, thousands, hundreds, tens, and ones",
    "isReadiness": true,
    "prompt": "An expression is shown:\n\n5 + 700 + 40\n\nWhat number is equivalent to this expression?",
    "options": [],
    "isGriddable": true,
    "correctAnswer": "745",
    "hint": "Put in standard place value order: 7 hundreds (700) + 4 tens (40) + 5 ones (5) = ?",
    "audioPrompt": "An expression is shown: 5 plus 700 plus 40. What number is equivalent to this expression?",
    "teaRationale": {
      "correctRationale": "745 is correct. Arrange by place value: 7 hundreds (700) + 4 tens (40) + 5 ones (5) = 745.",
      "distractorRationales": {}
    }
  },
  {
    "id": "staar-2022-m-q25",
    "questionNumber": 25,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 2,
    "reportingCategoryTitle": "Computations and Algebraic Relationships",
    "teks": "3.4H",
    "teksDescription": "Determine the number of objects in each group when a set of objects is partitioned into equal shares",
    "isReadiness": false,
    "prompt": "Greg had a package of 14 stars to put on 2 posters. He put the same number of stars on each poster, and he used all the stars in the package.\n\nHow many stars did Greg put on each poster?",
    "options": [
      {
        "id": "A",
        "text": "28"
      },
      {
        "id": "B",
        "text": "16"
      },
      {
        "id": "C",
        "text": "12"
      },
      {
        "id": "D",
        "text": "7"
      }
    ],
    "isGriddable": false,
    "correctAnswer": "D",
    "hint": "Divide 14 stars into 2 equal groups: 14 \u00f7 2 = ?",
    "audioPrompt": "Greg had a package of 14 stars to put on 2 posters. He put the same number on each poster. How many stars did Greg put on each poster?",
    "teaRationale": {
      "correctRationale": "Option D is correct. 14 stars partitioned equally into 2 posters: 14 \u00f7 2 = 7 stars per poster.",
      "distractorRationales": {
        "A": "Option A is incorrect. The student multiplied 14 \u00d7 2 = 28 instead of dividing.",
        "B": "Option B is incorrect. The student added 14 + 2 = 16 instead of dividing.",
        "C": "Option C is incorrect. The student subtracted 14 - 2 = 12 instead of dividing."
      }
    }
  },
  {
    "id": "staar-2022-m-q26",
    "questionNumber": 26,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 1,
    "reportingCategoryTitle": "Numerical Representations and Relationships",
    "teks": "3.3F",
    "teksDescription": "Explain that two fractions are equivalent if and only if they are both represented by the same point on the number line or represent the same portion of a whole",
    "isReadiness": true,
    "prompt": "Fraction strips can be used to find equivalent fractions.\n\nWhich fraction is equivalent to 2/4?",
    "options": [
      {
        "id": "F",
        "text": "1/2"
      },
      {
        "id": "G",
        "text": "2/6"
      },
      {
        "id": "H",
        "text": "3/4"
      },
      {
        "id": "J",
        "text": "1/3"
      }
    ],
    "isGriddable": false,
    "correctAnswer": "F",
    "hint": "Divide both the numerator and denominator of 2/4 by 2: (2\u00f72)/(4\u00f72) = 1/2.",
    "audioPrompt": "Which fraction is equivalent to 2 fourths?",
    "teaRationale": {
      "correctRationale": "Option F is correct. 2/4 simplifies to 1/2 because two 1/4 strips span the exact same length as one 1/2 strip.",
      "distractorRationales": {
        "G": "Option G is incorrect. 2/6 is equivalent to 1/3, not 1/2.",
        "H": "Option H is incorrect. 3/4 is greater than 2/4.",
        "J": "Option J is incorrect. 1/3 is less than 1/2."
      }
    }
  },
  {
    "id": "staar-2022-m-q27",
    "questionNumber": 27,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 2,
    "reportingCategoryTitle": "Computations and Algebraic Relationships",
    "teks": "3.5E",
    "teksDescription": "Represent real-world relationships using number pairs in a table and verbal descriptions",
    "isReadiness": true,
    "prompt": "Shelly needs tickets for rides at an amusement park. The table shows the relationship between tickets and rides:\n\n\u2022 6 tickets \u2192 3 rides\n\u2022 12 tickets \u2192 6 rides\n\u2022 18 tickets \u2192 9 rides\n\u2022 24 tickets \u2192 12 rides\n\nBased on the relationship shown in the table, which statement is true?",
    "options": [
      {
        "id": "A",
        "text": "Shelly needs 3 tickets for each ride, because the number of tickets minus 3 equals the number of rides."
      },
      {
        "id": "B",
        "text": "Shelly needs 3 tickets for each ride, because the number of tickets plus 3 equals the number of rides."
      },
      {
        "id": "C",
        "text": "Shelly needs 2 tickets for each ride, because the number of tickets divided by 2 equals the number of rides."
      },
      {
        "id": "D",
        "text": "Shelly needs 2 tickets for each ride, because the number of tickets times 2 equals the number of rides."
      }
    ],
    "isGriddable": false,
    "correctAnswer": "C",
    "hint": "Check the rule for every row: 6 \u00f7 2 = 3, 12 \u00f7 2 = 6, 18 \u00f7 2 = 9, 24 \u00f7 2 = 12. Each ride requires 2 tickets.",
    "audioPrompt": "Based on the relationship shown in the table for tickets and rides, which statement is true?",
    "teaRationale": {
      "correctRationale": "Option C is correct. In every row, Tickets \u00f7 2 = Rides (6 \u00f7 2 = 3, 12 \u00f7 2 = 6, etc.). This means each ride costs 2 tickets.",
      "distractorRationales": {
        "A": "Option A is incorrect. Subtracting 3 only works for the first row (6 - 3 = 3), but fails for the other rows (12 - 3 \u2260 6).",
        "B": "Option B is incorrect. Adding 3 does not match the table relationship.",
        "D": "Option D is incorrect. Tickets times 2 would give 6 \u00d7 2 = 12, not 3."
      }
    }
  },
  {
    "id": "staar-2022-m-q28",
    "questionNumber": 28,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 1,
    "reportingCategoryTitle": "Numerical Representations and Relationships",
    "teks": "3.4I",
    "teksDescription": "Determine if a number is even or odd using divisibility by 2 or grouping",
    "isReadiness": false,
    "prompt": "Which statement about the number 27 is true?",
    "options": [
      {
        "id": "F",
        "text": "It is even because the digit in the tens place is even."
      },
      {
        "id": "G",
        "text": "It is odd because the digit in the ones place is odd."
      },
      {
        "id": "H",
        "text": "It is even because it can be divided by 9 evenly."
      },
      {
        "id": "J",
        "text": "It is odd because it can be divided by 2 evenly."
      }
    ],
    "isGriddable": false,
    "correctAnswer": "G",
    "hint": "A number is odd or even based on its ONES digit. The ones digit of 27 is 7, which is an odd number (1, 3, 5, 7, 9).",
    "audioPrompt": "Which statement about the number 27 is true?",
    "teaRationale": {
      "correctRationale": "Option G is correct. The digit in the ones place determines whether a whole number is odd or even. 7 is odd, so 27 is odd.",
      "distractorRationales": {
        "F": "Option F is incorrect. The tens place digit does not determine even or odd.",
        "H": "Option H is incorrect. Divisibility by 9 does not define evenness (9 and 27 are odd).",
        "J": "Option J is incorrect. Even numbers are divisible by 2; 27 divided by 2 leaves a remainder of 1."
      }
    }
  },
  {
    "id": "staar-2022-m-q29",
    "questionNumber": 29,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 3,
    "reportingCategoryTitle": "Geometry and Measurement",
    "teks": "3.6E",
    "teksDescription": "Decompose two congruent two-dimensional figures into parts with equal areas and express the area of each part as a unit fraction of the whole",
    "isReadiness": false,
    "prompt": "Derrick drew two congruent figures (identical in shape and size) and then shaded 1/4 of each figure.\n\nWhich answer choice describes two congruent figures with exactly 1/4 of each figure shaded?",
    "options": [
      {
        "id": "A",
        "text": "Two figures of different sizes, one with 1 of 4 parts shaded and one with 2 of 4 parts shaded."
      },
      {
        "id": "B",
        "text": "Two congruent squares, one divided into 2 parts with 1 shaded, and one divided into 4 parts with 2 shaded."
      },
      {
        "id": "C",
        "text": "Two congruent rectangles divided into unequal portions."
      },
      {
        "id": "D",
        "text": "Two identical congruent squares, each partitioned into 4 equal-sized parts, with exactly 1 part shaded in each square."
      }
    ],
    "isGriddable": false,
    "correctAnswer": "D",
    "hint": "Congruent means the figures are identical in shape and size. 1/4 means divided into 4 equal parts with 1 part shaded.",
    "audioPrompt": "Derrick drew two congruent figures and shaded 1 fourth of each figure. Which answer choice describes Derrick's figures?",
    "teaRationale": {
      "correctRationale": "Option D is correct. Congruent shapes have identical dimensions. Dividing each into 4 equal parts and shading 1 part represents 1/4 of each whole.",
      "distractorRationales": {
        "A": "Option A is incorrect because the figures are different sizes and different fractions are shaded.",
        "B": "Option B is incorrect because 1/2 and 2/4 are shaded rather than 1/4.",
        "C": "Option C is incorrect because parts must be equal in area to represent fourths."
      }
    }
  },
  {
    "id": "staar-2022-m-q30",
    "questionNumber": 30,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 2,
    "reportingCategoryTitle": "Computations and Algebraic Relationships",
    "teks": "3.4K",
    "teksDescription": "Solve one-step and two-step problems involving multiplication and division within 100",
    "isReadiness": true,
    "prompt": "Alex bought 4 packages of pink golf balls and 2 packages of orange golf balls. There were 12 golf balls in each package.\n\nHow many golf balls did Alex buy in total?",
    "options": [
      {
        "id": "F",
        "text": "72"
      },
      {
        "id": "G",
        "text": "50"
      },
      {
        "id": "H",
        "text": "96"
      },
      {
        "id": "J",
        "text": "18"
      }
    ],
    "isGriddable": false,
    "correctAnswer": "F",
    "hint": "First find the total number of packages: 4 + 2 = 6 packages. Then multiply by 12 golf balls per package: 6 \u00d7 12 = ?",
    "audioPrompt": "Alex bought 4 packages of pink golf balls and 2 packages of orange golf balls. There were 12 golf balls in each package. How many golf balls did Alex buy?",
    "teaRationale": {
      "correctRationale": "Option F is correct. Step 1: Total packages = 4 + 2 = 6 packages. Step 2: Total golf balls = 6 \u00d7 12 = 72 golf balls (or (4 \u00d7 12) + (2 \u00d7 12) = 48 + 24 = 72).",
      "distractorRationales": {
        "G": "Option G is incorrect. The student added 48 + 2 = 50 instead of multiplying the 2 packages by 12.",
        "H": "Option H is incorrect. Multiplication calculation error.",
        "J": "Option J is incorrect. The student added all numbers: 4 + 2 + 12 = 18."
      }
    }
  },
  {
    "id": "staar-2022-m-q31",
    "questionNumber": 31,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 4,
    "reportingCategoryTitle": "Data Analysis and Personal Financial Literacy",
    "teks": "3.8A",
    "teksDescription": "Summarize a data set with multiple categories using a pictograph with scaled intervals",
    "isReadiness": true,
    "prompt": "A pictograph shows the number of games won by each team in a volleyball league. The key states:\n\n\ud83c\udfd0 = 3 games won\n\n\u2022 Spikes: 4 symbols\n\u2022 Aces: 3 symbols\n\u2022 Stars: 5 symbols\n\u2022 Nets: 2 symbols\n\u2022 Digs: 1 symbol\n\nWhich table represents the data in the pictograph?",
    "options": [
      {
        "id": "A",
        "text": "Spikes: 12 | Aces: 15 | Stars: 9 | Nets: 6 | Digs: 3"
      },
      {
        "id": "B",
        "text": "Spikes: 4 | Aces: 3 | Stars: 5 | Nets: 2 | Digs: 1"
      },
      {
        "id": "C",
        "text": "Spikes: 12 | Aces: 9 | Stars: 15 | Nets: 6 | Digs: 3"
      },
      {
        "id": "D",
        "text": "Spikes: 4 | Aces: 5 | Stars: 3 | Nets: 2 | Digs: 1"
      }
    ],
    "isGriddable": false,
    "correctAnswer": "C",
    "hint": "Multiply each symbol count by 3: Spikes has 4 \u00d7 3 = 12, Aces has 3 \u00d7 3 = 9, Stars has 5 \u00d7 3 = 15.",
    "audioPrompt": "A pictograph shows volleyball games won where each symbol means 3 games. Which table represents the data in the pictograph?",
    "teaRationale": {
      "correctRationale": "Option C is correct. Multiply each team's symbol count by 3: Spikes = 4 \u00d7 3 = 12; Aces = 3 \u00d7 3 = 9; Stars = 5 \u00d7 3 = 15; Nets = 2 \u00d7 3 = 6; Digs = 1 \u00d7 3 = 3.",
      "distractorRationales": {
        "A": "Option A is incorrect. The values for Aces and Stars are reversed.",
        "B": "Option B is incorrect. It counts the number of symbols without multiplying by the scale factor of 3.",
        "D": "Option D is incorrect. Symbol count without scale factor and values reversed."
      }
    }
  },
  {
    "id": "staar-2022-m-q32",
    "questionNumber": 32,
    "year": "2022",
    "grade": 3,
    "subject": "Mathematics",
    "reportingCategory": 2,
    "reportingCategoryTitle": "Computations and Algebraic Relationships",
    "teks": "3.4A",
    "teksDescription": "Solve with fluency one-step and two-step problems involving addition and subtraction within 1,000",
    "isReadiness": true,
    "prompt": "At the beginning of September, Mr. Watkins had 543 erasers.\n\n\u2022 During September he gave his students 99 of the erasers.\n\u2022 During October he gave his students 212 of the erasers.\n\nHow many erasers did Mr. Watkins have at the end of October?",
    "options": [
      {
        "id": "F",
        "text": "854"
      },
      {
        "id": "G",
        "text": "232"
      },
      {
        "id": "H",
        "text": "430"
      },
      {
        "id": "J",
        "text": "344"
      }
    ],
    "isGriddable": false,
    "correctAnswer": "G",
    "hint": "Subtract the erasers given away from 543: Total given away = 99 + 212 = 311. Then 543 - 311 = ?",
    "audioPrompt": "At the beginning of September, Mr. Watkins had 543 erasers. He gave away 99 in September and 212 in October. How many erasers did he have left at the end of October?",
    "teaRationale": {
      "correctRationale": "Option G is correct. Total erasers given away = 99 + 212 = 311. Erasers remaining = 543 - 311 = 232 (or 543 - 99 = 444, then 444 - 212 = 232).",
      "distractorRationales": {
        "F": "Option F is incorrect. The student added all numbers: 543 + 99 + 212 = 854.",
        "H": "Option H is incorrect. Subtraction error in place value regrouping.",
        "J": "Option J is incorrect. The student only subtracted 99 (543 - 99 = 444) and forgot or miscalculated October."
      }
    }
  }
]
};
