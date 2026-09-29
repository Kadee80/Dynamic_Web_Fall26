import axios from 'axios'

const KEY = import.meta.env.VITE_UNSPLASH_KEY

export const searchImages = async (term) => {
  // await is a note to JS saying please dont continue executing code
  // until response Promise is resolved
  const response = await axios.get('https://api.unsplash.com/search/photos', {
    headers: {
      Authorization: `Client-ID ${KEY}`,
    },
    params: {
      query: term,
    },
  })
  return response.data.results
}
