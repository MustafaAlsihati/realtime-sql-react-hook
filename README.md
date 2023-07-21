# Realtime SQL React Hook

React hook for connecting to a websocket that listens to SQL changes on a specific table by passing the table name and a condition and the parameters to your own custom websocket.

**NOTE: You need to create your own websocket that will listen to table changes, this hook will only connect to your websocket from front-end side.**

---

### Installation:

```
yarn add realtime-sql-react-hook
```

### Usage:

```
import {useRealtimeSQL} from 'realtime-sql-react-hook'

const App = () => {
  const token = user.token;

  const data = useRealtimeSQL<User | null>(
    'ws://websocket.io',
    'users',
    'WHERE id=? AND email=?',
    [user.id, user.email],
    {
      initState: null,
      token
    }
  );

  return <></>
}
```
