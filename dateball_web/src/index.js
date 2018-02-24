import dva from 'dva';
import createLoading from 'dva-loading';
import createHistory from 'history/createBrowserHistory';
import './index.css';

const ERROR_MSG_DURATION = 3;
// 1. Initialize
const app = dva({
	history:createHistory(),
	onError(e){
		console.error(e.message, ERROR_MSG_DURATION);
	}
});

// 2. Plugins
 app.use(createLoading());

// 3. Model
// app.model(require('./models/example').default);

// 4. Router
app.router(require('./router').default);

window.gApp = app;
// 5. Start
app.start('#root');
