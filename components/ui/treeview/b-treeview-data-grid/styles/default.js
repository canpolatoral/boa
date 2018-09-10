'use strict';

export default {
  tree: {
    base: {
      listStyle: 'none',
      backgroundColor: '#fff',
      margin: 0,
      paddingLeft: 0,
      paddingRight: 24,
      paddingTop: 24,
      paddingBottom: 24
    },
    node: {
      base: {
        position: 'relative',
        direction: 'initial'
      },
      link: {
        cursor: 'pointer',
        position: 'relative',
        padding: '2px 5px',
        display: 'block'
      },
      activeLink: {
        background: '#1976d2',
        color: '#efefef',
        borderRadius: '2px'
      },
      toggle: {
        base: {
          position: 'relative',
          display: 'inline-block',
          verticalAlign: 'top',
          marginLeft: '-5px',
          height: '24px',
          width: '24px'
        },
        baseRight: {
          position: 'relative',
          display: 'inline-block',
          verticalAlign: 'top',
          marginRight: '-5px',
          height: '24px',
          width: '24px'
        },
        wrapper: {
          position: 'absolute',
          top: '40%',
          left: '50%',
          margin: '-7px 0 0 -5px',
          height: '10px'
        },
        wrapperRight: {
          position: 'absolute',
          top: '40%',
          right: '50%',
          margin: '-7px -5px 0 0',
          height: '10px'
        },
        height: 10,
        width: 10,
        arrow: {
          fill: '#666666',
          strokeWidth: 0
        }
      },
      header: {
        base: {
          display: 'inline-block',
          verticalAlign: 'top'
        },
        connector: {
          width: '2px',
          height: '12px',
          borderLeft: 'solid 2px black',
          borderBottom: 'solid 2px black',
          position: 'absolute',
          top: '0px',
          left: '-21px'
        },
        connectorRight: {
          width: '2px',
          height: '12px',
          borderLeft: 'solid 2px black',
          borderBottom: 'solid 2px black',
          position: 'absolute',
          top: '0px',
          right: '-21px'
        },
        title: {
          lineHeight: '24px',
          verticalAlign: 'middle'
        }
      },
      subtree: {
        listStyle: 'none',
        paddingLeft: '19px'
      },
      subtreeRight: {
        listStyle: 'none',
        paddingRight: '19px'
      },
      loading: {
        color: '#E2C089'
      }
    },
  },
  searchWrap: {
    div: {

    },
    searchInput: {
      display: 'inline-block',
      width:'calc(100% - 29px)',
    },
    searchIcon: {
      display: 'inline-block',
      marginBottom: '-8px',
      marginRight: '5px'
    },
    searchIconRight: {
      display: 'inline-block',
      marginBottom: '-8px',
      marginLeft: '5px'
    }
  }
};
