export default {
  //inserted componentUpdated
  inserted(el, b, vnode) {
    // const style = document.createElement('style')
    // style.innerHTML = `
    // .tabautowidth{
    //   white-space : nowrap !important;
    //   min-width : fit-content !important;
    // }
    // .tabautowidthc{
    //   width : 0 !important;
    // }`
    // el.appendChild(style)
    el.observer = new MutationObserver(() => {
      // if (new Date() - el.dataset.time < 300) return
      // el.dataset.time = new Date().getTime()
      el.observer.disconnect();
      elUpdate(el, b, vnode);
    });
    el.observer.observe(el, {
      attributeFilter: ["style"],
      // childList: true,
      // characterData: true,
      subtree: true,
    });

    // elUpdate(el, b, vnode)
  },

  // componentUpdated(el, b, vnode) {
  //   elUpdate(el, b, vnode)
  // },

  // update(el, b, vnode) {
  //   elUpdate(el, b, vnode)
  // },

  //   unbind(el) {
  //     if (el.observer) {
  //       el.observer.disconnect()
  //       el.observer = null
  //     }
  //   },
};

const elUpdate = async (el, b, vnode) => {
  const vm = vnode.context;
  // await vm.$nextTick()
  let thl = [
    ...[
      ...el.getElementsByTagName("thead")[0].getElementsByTagName("th"),
    ].filter((el) => !el.className.includes("gutter")),
  ];
  const fixedright = el.querySelector(".el-table__fixed-right thead");
  if (fixedright) thl.push(...fixedright.getElementsByTagName("th"));
  // const val0 = () => {
  //   return new Promise(resolve => {
  //     const int = setInterval(() => {
  //       thl = [
  //         ...[
  //           ...el.getElementsByTagName('thead')[0].getElementsByTagName('th'),
  //         ].filter(el => !el.className.includes('gutter')),
  //       ]
  //       const fixedright = el.querySelector('.el-table__fixed-right thead')
  //       if (fixedright) thl.push(...fixedright.getElementsByTagName('th'))
  //       if (thl.length > 0) {
  //         clearInterval(int)
  //         resolve()
  //       }
  //     }, 100)
  //   })
  // }
  // if (thl.length == 0) await val0()

  let td = [...el.getElementsByTagName(`td`)];
  // const val1 = () => {
  //   return new Promise(resolve => {
  //     const int = setInterval(() => {
  //       td = [...el.getElementsByTagName(`td`)]
  //       if (td.length > 0) {
  //         clearInterval(int)
  //         resolve()
  //       }
  //     }, 100)
  //   })
  // }
  // if (td.length == 0) await val1()

  for (const th of thl) {
    const col = [th, ...td.filter((el) => el.classList[0] == th.classList[0])];
    // const val2 = () => {
    //   return new Promise(resolve => {
    //     const int = setInterval(() => {
    //       if (col[0].querySelector('.cell').scrollWidth != 0) {
    //         clearInterval(int)
    //         resolve()
    //       }
    //     }, 100)
    //   })
    // }
    // if (col[0].querySelector('.cell').scrollWidth == 0) await val2()

    const widthList = col.map((el) => {
      const cell = el.querySelector(".cell");
      // cell.classList.add('tabautowidth', 'tabautowidthc')
      cell.style.whiteSpace = "nowrap";
      cell.style.minWidth = "fit-content";
      cell.style.width = 0;
      let w = cell.scrollWidth;
      if (w > 500) {
        cell.style.minWidth = "normal";
        cell.style.whiteSpace = "normal";
        w = 500;
      } else if (w < 100) {
        w = 100;
      }
      // cell.classList.remove('tabautowidthc')
      cell.style.width = "";
      return w;
    });
    const width = Math.max(...widthList);
    vm.$set(b.value, th.textContent, width);
  }

  // console.log(b.value)

  el.observer.observe(el, {
    attributeFilter: ["style"],
    // childList: true,
    // characterData: true,
    subtree: true,
  });
};
