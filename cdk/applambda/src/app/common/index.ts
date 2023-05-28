import * as request from 'request';

export function checkEnv(v: string | undefined): string {
  if (v === undefined) {
    throw new Error();
  }
  return v;
}

export function asyncRequest(options: any) {
  return new Promise((resolve: (v: any) => void, reject) => {
    request.post(options, (error: any, res: { statusCode: number }, body: any) => {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

export function asyncGet(options: any) {
  return new Promise((resolve: (v: any) => void, reject) => {
    request.get(options, (error: any, res: { statusCode: number }, body: any) => {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}


export function formatDate(dt:Date) {
  var y = dt.getFullYear();
  var m = ('00' + (dt.getMonth()+1)).slice(-2);
  var d = ('00' + dt.getDate()).slice(-2);
  return (y + '-' + m + '-' + d);
}