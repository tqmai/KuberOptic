import React, { useState, createContext } from 'react';
import { isNullOrUndefined } from 'util';

export const StoreContext = createContext(null);

export const StoreContextProvider = (props: any) => {
  
  const [Store, setStore] = useState({
    landingPageState: false,
    uploadPageState: false,
    uploadPageState2:false,
    gcpDeployPage:false,
    credentials: {}, //google
    clusters: null,
    gcploc: { // GCP location(s)
      'us-central1-a': false,
      'us-central1-b': false,
      'us-central1-c': false,
      'southamerica-east1-a': false,
      'southamerica-east1-b': false,
      'southamerica-east1-c': false,
      'europe-west2-a': false,
      'us-west1-a': false
    }, 
    clusterCount:0,
    awsKey:null,
    awsSecret:null,
    awsClusterName:null,
    awsLocation:null,
    awsDeployPage: false
  })

  return (
  <StoreContext.Provider value={[Store, setStore]}>
      {props.children}
  </StoreContext.Provider>
  )
}

export default StoreContext;
