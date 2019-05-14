import LoggedInPage from '../../components/pages/logged-in'
import { watch } from 'react-referential'

import { withStyles } from '@material-ui/core/styles'

class Networks extends LoggedInPage {
}

const styles = (theme) => {
  return {
    appBar: {
      top: 64,
      zIndex: 1202,
    },
    flexGrow: {
      flexGrow: 1,
    },
    noPadding: {
      padding: '0 !important'
    },
    breadcrumbs: {
      backgroundColor: 'white',
      minHeight: 48,
    },
    breadcrumbLink: {
      color: 'black',
      marginRight: '1rem',
    },
    fab: {
      margin: theme.spacing.unit,
    },
    launchText: {
      marginRight: theme.spacing.unit,
    },
  }
}

export default withStyles(styles)(Networks)

