import toast from 'react-hot-toast';

const fetchToast = async (fetchPromise, options, style = { style: { minWidth: '18rem' } }) => {
  const promise = new Promise((resolve, reject) => {
    fetchPromise.then((res) => {
      if (res.ok) {
        resolve(res);
      } else {
        res.json().then((body) => {
          reject(body);
        });
      }
    });
  });

  await toast.promise(promise, options, style);
};

export default fetchToast;
