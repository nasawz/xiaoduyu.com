import TopicsLoadData from '@modules/topics/load-data';

import { loadPostsList } from '@actions/posts';
import { saveTab } from '@actions/website';

export default ({ store, match, res, req, user }: any) => {
  return new Promise(async resolve => {

    
      let tab = req.cookies['tab'] || 'home';

      if (!user) {
        tab = 'home';
      }

      saveTab(tab)(store.dispatch, store.getState);
    

    Promise.all([
      new Promise(async resolve => {

        if (user) {
          resolve();
          return;
        }
        
        await loadPostsList({
          id:'home',
          args: {
            sort_by: "sort_by_date",
            deleted: false,
            weaken: false
          }
        })(store.dispatch, store.getState);

        resolve();

      }),
      TopicsLoadData({ store, match, res, req, user })
    ]).then(res=>{
      resolve({ code:200 });
    }).catch(err=>{
      resolve({ code:200 });
    });

  });
}
