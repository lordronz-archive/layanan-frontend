export const mySwalOpts = (theme?: string) => ({
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  color: !theme || theme === 'dark' ? '#eee' : '#111',
  background: !theme || theme === 'dark' ? '#111' : '#eee',
});

export default mySwalOpts;
