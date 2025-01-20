import { makeAutoObservable, observable, action, runInAction } from "mobx";

class QueryParamsStore {
  params: Map<string, string>;
  isInternalUpdate = false;

  constructor() {
    makeAutoObservable(this, {
      params: observable.shallow,
      setParam: action,
      updateFromUrl: action,
    });
    this.params = observable.map<string, string>();
    this.updateFromUrl();

    window.addEventListener("popstate", () => {
      this.updateFromUrl();
    });
  }

  // Synchronize the store with the current URL
  updateFromUrl() {
    if (this.isInternalUpdate) return; // Skip if this was triggered by our own update

    const searchParams = new URLSearchParams(window.location.search);
    console.log("tktk searchParams", searchParams);
    runInAction(() => {
      const newStuff = searchParams.entries();
      const newStuffMap = new Map(newStuff);
      console.log("tktk newStuffMap", newStuff, newStuffMap);
      // for each key, value pair in the existing params that is not in the new stuff, delete it
      this.params.forEach((_value, key) => {
        if (!newStuffMap.has(key)) {
          this.params.delete(key);
        }
      });
      for (const [key, value] of newStuff) {
        this.params.set(key, value);
      }
      this.updateUrl();
    });
  }

  // Set a query parameter and update the URL
  setParam(key: string, value: string) {
    this.params.set(key, value);
    this.updateUrl();
  }

  // Update the browser's URL based on the store's state
  updateUrl() {
    this.isInternalUpdate = true;
    const searchParams = new URLSearchParams();
    for (const [key, value] of this.params.entries()) {
      searchParams.set(key, value);
    }
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({}, "", newUrl);
    this.isInternalUpdate = false;
  }

  // Get a specific query parameter
  getParam(key: string): string | undefined {
    return this.params.get(key);
  }

  /**
   * Merge params with the existing params.
   */
  mergeParams(params: Record<string, string>) {
    Object.entries(params).forEach(([key, value]) => {
      this.params.set(key, value);
    });
    this.updateUrl();
  }

  /**
   * Set params to the new params (existing params that are not in the new params are deleted)
   */
  setParams(newParams: Record<string, string>) {
    for (const item of [...this.params]) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [key, _value] = item;
      if (!newParams[key]) {
        this.params.delete(key);
      } else {
        if (this.params.get(key) !== newParams[key]) {
          this.params.set(key, newParams[key]);
        }
      }
    }

    for (const key in newParams) {
      if (!this.params.has(key)) {
        this.params.set(key, newParams[key]);
      }
    }

    this.updateUrl();
  }
}

export const queryParamsStore = new QueryParamsStore();
