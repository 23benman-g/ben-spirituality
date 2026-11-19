// Replace placeholders only with your OWN artwork and writing.
// Place your images in ./artworks/ and set image to a relative path.
export const essentialQuestion = 'In a world full of distractions, how can we find deeper meaning through time, beauty, and human connection?';
export const themes = [
  {name:'Time & Presence',short:'TIME',description:'Mindfulness, meditation, gratitude, and the present moment.'},
  {name:'Awe & Beauty',short:'AWE',description:'Wonder, nature, originality, and the small self.'},
  {name:'Human Connection',short:'CONNECTION',description:'Dignity, relationships, kindness, and love.'}
];
export const artworks = Array.from({length:9},(_,i)=>({
  id:`art-${i+1}`,theme:Math.floor(i/3),
  title:`Original Artwork ${i+1}`,creator:'Your name',
  image:'', // e.g. './artworks/my-photo.jpg'
  description:'Add your original artwork description here.',
  reflection:'Add your own personal reflection here.',
  concepts:'Add the class concepts you are connecting here.',
  connection:'Explain how this work answers your essential question.'
}));
