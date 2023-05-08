let  {
  PopupManager
} =window.ElUI.utils;

/* eslint-disable */
PopupManager.nextZIndex =  function() {
  // let extzindex = Ext.WindowMgr.zseed+5;
  let extzindex = 1000;
  if(PopupManager.zIndex<extzindex){
    PopupManager.zIndex = extzindex;
  }
  return PopupManager.zIndex++;
}
/* eslint-disable */