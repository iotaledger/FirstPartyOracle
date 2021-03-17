const config = {
	node_config: {
		id: '',
		node: '',
		whitelist: []
	},
	send_options: {
		depth: 1,
		min_weight_magnitude: 14,
		local_pow: true,
		threads: 1
	},
	req_input: {
		ticker: 60000,
		request: {
			url: '',
			header: {},
			body: {}
		}
	}
};

export default config;