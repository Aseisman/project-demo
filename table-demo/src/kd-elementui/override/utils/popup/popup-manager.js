let  {
  PopupManager
} =window.ElUI.utils;


PopupManager.nextZIndex =  function() {
  let extzindex = 1000;
  // let extzindex = Ext.WindowMgr.zseed+5;
  if(PopupManager.zIndex<extzindex){
    PopupManager.zIndex = extzindex;
  }
  return PopupManager.zIndex++;
}
