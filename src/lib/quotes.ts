export interface Quote {
  text: string
  source: string
}

// Well-known lines from Л. Н. Толстой, «Война и мир» (общественное достояние).
export const TOLSTOY_QUOTES: Quote[] = [
  {
    text: 'Нет величия там, где нет простоты, добра и правды.',
    source: 'Л. Н. Толстой, «Война и мир»',
  },
  {
    text: 'Всё, всё, что я понимаю, я понимаю только потому, что люблю.',
    source: 'Л. Н. Толстой, «Война и мир»',
  },
  {
    text: 'Время и терпение — вот мои воины-богатыри!',
    source: 'Л. Н. Толстой, «Война и мир» (слова Кутузова)',
  },
  {
    text: 'Ежели бы все воевали только по своим убеждениям, войны бы не было.',
    source: 'Л. Н. Толстой, «Война и мир»',
  },
  {
    text: 'Что такое хорошо и что такое дурно? Что надо любить и что ненавидеть? Для чего жить и что такое я?',
    source: 'Л. Н. Толстой, «Война и мир»',
  },
]

export function getQuoteOfTheDay(date: Date = new Date()): Quote {
  const startOfYear = new Date(date.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86_400_000)
  return TOLSTOY_QUOTES[dayOfYear % TOLSTOY_QUOTES.length]
}
