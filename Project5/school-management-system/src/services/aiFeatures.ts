export function generateStory(topic: string, age: number): string {
  const stories: Record<string, string> = {
    'friendship': `Once upon a time, in a colorful garden, a little ${age > 4 ? 'rabbit' : 'bunny'} named Hopper wanted to make friends. Hopper met a shy butterfly, a busy bee, and a gentle ladybug. They all became best friends and played together every day under the rainbow. The end.`,
    'adventure': `Little探险家 ${age > 4 ? 'Max' : 'Tommy'} found a magic map in the attic! The map led to a treasure chest filled with ${age > 4 ? 'colorful gems' : 'shiny stars'}. Along the way, ${age > 4 ? 'Max' : 'Tommy'} helped a lost bird find its nest and made a new friend.`,
    'animals': `In the heart of Sunny Forest, all the animals gathered for the annual talent show. ${age > 4 ? 'Oliver the Owl' : 'Ollie the Owl'} played the piano, ${age > 4 ? 'Daisy the Deer' : 'Dolly the Deer'} danced, and everyone cheered!`,
    'nature': `A tiny seed named Sprout wanted to grow big and strong. With help from the sun, rain, and a friendly worm, Sprout grew into a beautiful flower that made everyone smile.`,
    'space': `Blast off! Little ${age > 4 ? 'Astronaut Amy' : 'Star Girl'} flew her rainbow rocket past the moon, danced with the stars, and waved at the planets. ${age > 4 ? 'She learned that the universe is full of wonder!' : 'What a magical space adventure!'}`,
  }
  return stories[topic] || stories['friendship']
}

export function generateQuiz(topic: string, _age: number) {
  const quizzes: Record<string, { question: string; options: string[]; answer: number }[]> = {
    'alphabets': [
      { question: 'Which letter comes after A?', options: ['B', 'C', 'D', 'E'], answer: 0 },
      { question: 'Which word starts with C?', options: ['Apple', 'Ball', 'Cat', 'Dog'], answer: 2 },
      { question: 'How many letters are in A-B-C?', options: ['2', '3', '4', '5'], answer: 1 },
    ],
    'numbers': [
      { question: 'What is 2 + 1?', options: ['2', '3', '4', '5'], answer: 1 },
      { question: 'Which is bigger, 5 or 8?', options: ['5', '8', 'Both', 'None'], answer: 1 },
      { question: 'Count the stars: ⭐⭐ How many?', options: ['1', '2', '3', '4'], answer: 1 },
    ],
    'colors': [
      { question: 'What color is the sky?', options: ['Red', 'Blue', 'Green', 'Yellow'], answer: 1 },
      { question: 'What color is a banana?', options: ['Red', 'Blue', 'Green', 'Yellow'], answer: 3 },
      { question: 'Mix red and yellow makes?', options: ['Green', 'Purple', 'Orange', 'Pink'], answer: 2 },
    ],
    'animals': [
      { question: 'Which animal says "Moo"?', options: ['Dog', 'Cat', 'Cow', 'Duck'], answer: 2 },
      { question: 'Which animal has a long trunk?', options: ['Giraffe', 'Elephant', 'Tiger', 'Monkey'], answer: 1 },
      { question: 'Which animal can fly?', options: ['Fish', 'Bird', 'Rabbit', 'Frog'], answer: 1 },
    ],
  }
  return quizzes[topic] || quizzes['alphabets']
}

export function generateHomework(grade: string, subject: string) {
  const tasks: Record<string, string[]> = {
    'kindergarten': {
      'english': ['Trace letters A-E', 'Color the apple red', 'Circle the letter that starts with "B"'],
      'math': ['Count 5 toys at home', 'Draw 3 circles and 2 squares', 'Practice writing number 1-5'],
      'general': ['Point to something blue', 'Name 3 animals you like', 'Sing the ABC song'],
    }[subject] || ['Practice for 10 minutes', 'Review today\'s lesson'],
    'nursery': {
      'english': ['Practice A-Z recognition', 'Identify 3 fruits by name', 'Circle the odd one out'],
      'math': ['Count to 20', 'Identify numbers 1-10', 'Match numbers to objects'],
      'evs': ['Name 3 vegetables', 'Identify 2 transport vehicles', 'Draw your favorite fruit'],
    }[subject] || ['Complete the worksheet', 'Practice for 10 minutes'],
  }
  return tasks[grade] || ['Complete today\'s lesson review']
}

export function generateParentReport(childName: string, weekScore: number, totalWeeks: number) {
  const avgScore = weekScore / totalWeeks
  const strengths = avgScore > 80 ? ['Excellent in academics', 'Great participation', 'Strong curiosity'] :
    avgScore > 60 ? ['Good progress', 'Shows interest in learning', 'Completes assignments'] :
    ['Needs encouragement', 'Developing at own pace', 'Shows potential in creative areas']

  const improvements = avgScore < 70 ? ['Focus on daily practice', 'More reading time', 'Regular revision'] :
    ['Continue the good work', 'Explore advanced topics', 'Practice writing skills']

  return {
    childName,
    period: 'This Week',
    attendance: `${85 + Math.floor(Math.random() * 15)}%`,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 2),
    teacherNote: avgScore > 80 ? `${childName} is doing wonderfully in class! Keep up the great work at home.` :
      avgScore > 60 ? `${childName} is making good progress. With a little extra practice, ${childName} will excel!` :
      `${childName} is a bright student who needs a bit more practice. We're working together to help ${childName} improve.`,
    nextSteps: improvements.slice(0, 2),
  }
}

export function generateActivityRecommendation(age: number, completedActivities: string[]) {
  const allActivities = [
    { title: 'Alphabet Matching', age: '3-4', category: 'literacy', emoji: '🔤' },
    { title: 'Number Counting', age: '3-4', category: 'math', emoji: '🔢' },
    { title: 'Color Recognition', age: '3-4', category: 'cognitive', emoji: '🎨' },
    { title: 'Shape Sorting', age: '3-4', category: 'cognitive', emoji: '⭐' },
    { title: 'Memory Cards', age: '4-5', category: 'memory', emoji: '🧠' },
    { title: 'Phonics Fun', age: '4-5', category: 'literacy', emoji: '🔤' },
    { title: 'Simple Addition', age: '5-6', category: 'math', emoji: '➕' },
    { title: 'Reading Practice', age: '5-6', category: 'literacy', emoji: '📖' },
    { title: 'Coding Puzzles', age: '5-6', category: 'logic', emoji: '💻' },
    { title: 'Science Exploration', age: '5-6', category: 'science', emoji: '🔬' },
  ]

  return allActivities
    .filter(a => !completedActivities.includes(a.title))
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
}
