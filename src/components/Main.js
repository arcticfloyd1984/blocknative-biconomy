import React, {Component} from 'react';

class Main extends Component {
	constructor(props) {
		super(props) 
		this.state = {
			output: ''
		}
	}


	render() {
		return (
			<form className="mb-3" onSubmit={(event) => {
				event.preventDefault()
				let nameValue
				nameValue = this.input.value;
				this.props.changeName(nameValue);
			}}>
				<div className="input-group mb-4">
					<input
						type="text"
						onChange={(event) => {
							const nameValue = this.input.value;
							this.setState({
								output: nameValue
							})
						}}
						ref={(input) => { this.input = input }}
						className= "form-control form-control-lg"
						placeholder="Enter string"
						required />
				</div>
		        <button type="submit" className="btn btn-primary btn-block btn-lg">CHANGE!</button>
			</form>


		);
	}
}

export default Main;