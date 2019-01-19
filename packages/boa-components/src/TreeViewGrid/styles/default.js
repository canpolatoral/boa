export default {
  tree: {
    base: {
      listStyle: 'none',
      backgroundColor: '#fff',
      fontWeight: 'bold',
      margin: 0,
      padding: 0,
      width: '100%',
    },
    node: {
      base: {
        position: 'relative',
        width: '100%',
      },
      link: {
        cursor: 'pointer',
        position: 'relative',
        // padding: '2px 0px',
        display: 'block',
      },
      activeLink: {
        background: '#EBF5FB',
        color: '#737373',
        borderRadius: '2px',
      },
      toggle: {
        base: {
          position: 'relative',
          display: 'inline-block',
          verticalAlign: 'middle',
          marginTop: '10px',
          marginLeft: '-5px',
          height: '18px',
          width: '24px',
        },
        baseRight: {
          position: 'relative',
          display: 'inline-block',
          verticalAlign: 'middle',
          marginTop: '10px',
          marginRight: '-5px',
          height: '18px',
          width: '24px',
        },
        wrapper: {
          position: 'absolute',
          top: '40%',
          left: '50%',
          margin: '-7px 0 0 -5px',
          height: '10px',
        },
        wrapperRight: {
          position: 'absolute',
          top: '40%',
          right: '50%',
          margin: '-7px 0 0 0',
          height: '10px',
        },
        height: 10,
        width: 10,
        arrow: {
          fill: '#666666',
          strokeWidth: 0,
        },
      },
      header: {
        base: {
          // marginTop:'-2px',
          // marginBottom: '-3px',
          display: 'inline-block',
          verticalAlign: 'top',
          fontWeight: 'bold',
          width: 'calc(100% - 21px)',
        },
        connector: {
          width: '2px',
          height: '12px',
          top: '0px',
          left: '-21px',
        },
        connectorRight: {
          width: '2px',
          height: '12px',
          top: '0px',
          right: '-21px',
        },
        title: {
          borderStyle: 'solid',
          borderWidth: '1.5px',
          fontWeight: 'bold',
          padding: '0px',
          lineHeight: '18px',
          verticalAlign: 'middle',
        },
      },
      subtree: {
        listStyle: 'none',
        paddingLeft: '30px',
        fontWeight: 'normal',
        display: 'inline-block',
      },
      subtreeRight: {
        listStyle: 'none',
        paddingRight: '30px',
        fontWeight: 'normal',
        display: 'inline-block',
      },
      loading: {
        color: '#E2C089',
      },
    },
  },
  searchWrap: {
    div: {},
    searchInput: {
      display: 'inline-block',
      width: 'calc(100% - 29px)',
    },
    searchIcon: {
      display: 'inline-block',
      marginBottom: '-8px',
      marginRight: '5px',
    },
    searchIconRight: {
      display: 'inline-block',
      marginBottom: '-8px',
      marginLeft: '5px',
    },
  },
};
