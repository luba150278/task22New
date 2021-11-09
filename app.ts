import express from "express";
import fetch from "cross-fetch";
import config from "./utils/config";
import { SourceMap } from "module";

const app = express(); //express init
const PORT = config.PORT; //used port

app.use(express.json()); //transform to JSON

type IP = {
  ip: string;
};
/**
 *
 * @param url
 * @returns
 */
function getDataFromApi(url: string): Promise<Response> {
  return fetch(url);
}
/**
 *
 * @param data
 * @returns
 */
function getIP(data: IP): string {
  return data.ip;
}
/**
 * Task3.1: get 3 random names from <url> used Promise.All
 * @param url
 */
function usePromiceAll(url: string) {
  const names: string[] = [];
  const requests = [0, 1, 2].map(async () => {
    return getDataFromApi(url);
  });
  Promise.all(requests)
    .then((responses) => {
      return responses;
    })
    .then((responses) => Promise.all(responses.map((r) => r.json())))
    .then((users) => users.forEach(async (user) => names.push(user.name)))
    .then(() => console.log(`Task#3.1 Used Promise.All: [${names}]`));
}
/**
 * Task3.2 get 3 random names from <url> used async/await but no used Promise.All
 * @param url
 */
function unUsePromiceAll(url: string) {
  const names: string[] = [];
  [0, 1, 2].map(async () => {
    const res = await getDataFromApi(url);
    await res
      .json()
      .then((item) => names.push(item.name))
      .then(() => {
        if (names.length === 3)
          console.log(
            `Task#3.2 Used async/await without Promise.All: [${names}]`
          );
      });
  });
}
/**
 * Task 3.3 random names from <url> withot using async/await and Promise.All
 * @param url
 */
function useClearPromise(url: string) {
  const names: string[] = [];
  [0, 1, 2].map(() => {
    let promise: Promise<Response> = new Promise((resolve, reject) => {
      return resolve(getDataFromApi(url));
    });

    promise
      .then((result) => result["json"]())
      .then((item) => names.push(item.name))
      .then(() => {
        if (names.length === 3)
          console.log(`Task#3.3 Used promise without async/await: [${names}]`);
      });
  });
}
let count = -1; //use for define count async requests on url
/**
 * Task 4.2 - get a first random user with "Female" gender  using async/await variant
 * @param url
 */
async function getGenderAsyncVariant(url: string) {
  const res = await getDataFromApi(url);

  await res.json().then((item) => {
    if (count === -1 && !item.hasOwnProperty(config.FIELD)) {
      console.log(`Object hasnt property ${config.FIELD}`);
      return;
    }
    count++;
    if (item.gender === "Female") {
      console.log(
        `Task#4.2 Made the ${count + 1} async request/s for find ${
          config.FIELD_VALUE
        } user:`
      );
      console.log(item);
      return;
    } else {
      if (count < 100) {
        getGenderAsyncVariant(url);
      } else {
        console.log(
          `Check 100 users and user with ${config.FIELD_VALUE} ${config.FIELD} wasn't found.`
        );
        return;
      }
    }
  });
}
let count2 = -1; //use for define count requests on url
/**
 * Task 4.1 - get a first random user with "Female" gender  no using async/await variant
 * @param url
 */
function getGenderSyncVariant(url: string) {
  let promise: Promise<Response> = new Promise((resolve, reject) => {
    return resolve(getDataFromApi(url));
  });
  promise
    .then((result) => result["json"]())
    .then((item) => {
      if (count === -1 && !item.hasOwnProperty(config.FIELD)) {
        console.log(`Object hasnt property ${config.FIELD}`);
        return;
      }
      count2++;
      if (item.gender === config.FIELD_VALUE) {
        console.log(
          `Task#4.1 Made the ${count2 + 1} sync request/s for find ${
            config.FIELD_VALUE
          } user:`
        );
        console.log(item);
        return;
      } else {
        if (count < 100) {
          getGenderSyncVariant(url);
        } else {
          console.log(
            `Check 100 users and user with ${config.FIELD_VALUE} ${config.FIELD} wasn't found.`
          );
          return;
        }
      }
    });
}
/**
 * Task#5 - create callback function, which use ip as parameter and apply in async function
 * @param ip
 * @param callBackFun
 * @returns
 */
async function useCallBackFun(
  ip: string,
  callBackFun: (value: string) => string
): Promise<string> {
  return callBackFun(ip);
}
/**
 * CallBack function for useCallBackFun
 * @param ip
 * @returns
 */
function callBackFun(ip: string): string {
  return ip;
}

// async function fn1(callback: Function): Promise<String> {
//   let res = await getDataFromApi(config.URL_FOR_IP);
//   const data = await res.json();
//   console.log(callback(data.ip));
//   return callback(data.ip);
// }

// async function fn2(callback: (id: string) => void): Promise<String> {
//   return await fn1(callback);
// }
async function firstFuncInTask6(url: string): Promise<String> {
  let res = await getDataFromApi(url);
  let data = await res.json();
  return data.ip;
}
async function cbForTask6(id: Promise<String>): Promise<String> {
  return await id;
}
async function secondFuncInTask6(
  callback: (initialText: Promise<String>) => void
) {
  return callback(firstFuncInTask6(config.URL_FOR_IP));
}

/**
 * main method for start app
 */
const start = async () => {
  try {
    //--------Task1------------
    let res = await fetch(config.URL_FOR_IP);
    const data = await res.json();
    console.log(`Task#1: ${data.ip}`);
    //-----Task2-------------
    const ip = getIP(data);
    console.log(`Task#2: ${ip}`);

    //----Task3---------------

    usePromiceAll(config.URL_FOR_NAME);
    unUsePromiceAll(config.URL_FOR_NAME);
    useClearPromise(config.URL_FOR_NAME);
    //-----------Task4----------

    getGenderAsyncVariant(config.URL_FOR_GENDER);
    getGenderSyncVariant(config.URL_FOR_GENDER);
    //-----------Task5------------
    console.log(`Task#5: ${await useCallBackFun(ip, callBackFun)}`);
    //fn2(callBackFun);
    let task6 = await secondFuncInTask6(cbForTask6);
    console.log(`Task#6: ${task6}`);
    //---------start server------------
    app.listen(PORT, () => {
      //console.log(`server started on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
