/**
 * ************************************
 *
 * @module  UploadPage2.tsx
 * @author
 * @date
 * @description upload page for clusters from Amazon Web Services
 *
 * ************************************
 */

import * as React from 'react';
import { useContext } from 'react';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {StoreContext} from '../../../store';
const { ipcRenderer } = require('electron');
import AWSDeploy from './awsDeploy'


const UploadPage2 = () => {
  const [Store, setStore] = useContext(StoreContext);

  ipcRenderer.on('clusterClient2', (event: any, arg: any) => {
    console.log('event on upload ',event);
    let newClusters = Store.clusters;
    arg.forEach(el=> newClusters.push(el))
    newClusters = Object.values(newClusters.reduce((allClusts, nextClust) => Object.assign(allClusts, { [nextClust.clusterName] : nextClust}), {}))
    setStore({...Store, clusters: newClusters, clusterCount: newClusters.length, visualize: true })
    console.log('clusters: ', newClusters, 'cluster count: ', Store.clusterCount, 'aws cluster names: ', Store.awsClusterName)
    console.log('arg :', arg)
    event.returnValue = 'done';
  })

  ipcRenderer.on('awsRegionDisplayFunc', (event: any, arg: any) => {
    console.log('running awsRegionDisplay')
    awsRegionDisplay(arg)
  })

  const awsRegionDisplay = (array) => {
    // setStore({...Store, awsClusterName: array})
    const arg = {
      name: array, 
      accessKeyId: Store.awsKey, 
      secretAccessKey: Store.awsSecret, 
      region: Store.awsDisplayRegion
    }
    console.log('awsRegionDisplay arg: ', arg)
    ipcRenderer.send('asynchronous-message2', arg)
    setStore({...Store, uploadPageState2: true, awsDeployPage: true, awsClusterName: array});
  }

  const handleKey = (e: React.FormEvent<HTMLInputElement>) => {
    console.log(e.currentTarget.value)  
    setStore({...Store, awsKey: e.currentTarget.value})
  }

  const handleSecret = (e: React.FormEvent<HTMLInputElement>) => {
    console.log(e.currentTarget.value)  
    setStore({...Store, awsSecret: e.currentTarget.value})
  }

  const handleRegion = (e) => {
    setStore({...Store, awsDisplayRegion: e.currentTarget.value})
    console.log('region is', Store.awsDisplayRegion)
  }

  const handleBack = ()=>{
    setStore({
      ...Store,
      uploadPageState:false, 
      uploadPageState2:false,
      landingPageState: false,
      landingPageState2: false,
      credentials: null,
      clusterCount: 0,
      clusters: [],
      visualize: false
    });
  };

  function handleSubmit() {
    console.log('handleSubmit region is', Store.awsDisplayRegion)
    if(typeof Store.awsSecret !== 'string' || typeof Store.awsKey !== 'string'){
      console.log('Enter a AWS key/secret to access AWS');
    }
    else {
      const arg = {
        // name: Store.awsClusterName, 
        accessKeyId: Store.awsKey, 
        secretAccessKey: Store.awsSecret, 
        region: Store.awsDisplayRegion
      }
      ipcRenderer.send('aws-login', arg)
    }
  }


  // Material-UI uses "CSS in JS" styling
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: { // currently not being used - maybe delete later
        display: 'flex',
      // flexGrow: 1
      },
      text: {
        align: 'center',
        margin: '0 0 50px 0', // will adjust later
      }
    }),
  );

  const classes = useStyles(); // this is showing an error but this is directly from Material-UI and is fine

  return (
    <>
      { Store.awsDeployPage ? <AWSDeploy/> :
      <div className='uploadDiv'>
        <div className="awsImageContainer">
          <img className='kubUpload' src={require('../assets/credsPage/aws.png')}/>
          <Typography className={classes.text} variant="h3">Amazon Web Services</Typography>
        </div>
        <input className='uploadInput' type="text" onChange={handleKey}  placeholder="awsKey" required={true}></input>
        <input className='uploadInput' type="text" onChange={handleSecret} placeholder="awsSecret" required={true}></input>
        <div>
          <select id='deployLoc' className='loc' onChange={handleRegion}>
          <option selected>Choose a location to display</option>
          <option value='us-east-1'>us-east-1</option>
          <option value='us-east-2'>us-east-2</option>
          <option value='us-west-1'>us-west-1</option>
          <option value='us-west-2'>us-west-2</option>
          </select>
        </div>
        <div id="uploadPage2SubmitandBackButts">
          <button id="uploadPage2Submit" className='uploadButt' onClick={handleSubmit}>Submit</button>
          <button id="uploadPage2BackButt" className = 'uploadButt' onClick={handleBack}>Back</button>
        </div>
      </div>
      }   
  </>
  )
}

export default UploadPage2;
