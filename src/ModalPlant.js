import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from 'react-select';

import Axios from 'axios'

const List = (props) => {
  if(props.item.sname !== ''){
    return <li>{props.item.label} <button id={props.item.value} onClick={props.delete}>delete</button></li>
  }

  return null;
}

const ModalrefCrude = (props) => {
  return (
    <Dialog open={props.open} onClose={props.close} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">You update herbal medicine with</DialogTitle>
          <DialogContent>
            <Select
              onChange={props.handleChange('addCrude')}
              options={props.baseCrude}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={props.close} color="primary">
              Cancel
            </Button>
            <Button onClick={props.handleAddCrude} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
  )
}
class ModalPlant extends Component {
    constructor(props) {
        super(props);
        this.state = {
          openModalCrude: false,
          addCrude: null,
          loading: true,
          _id: '',
          idplant:'',
          sname: '',
          refimg: '',
          refCrude: [],
        }
        this.handleSubmitUpdate = this.handleSubmitUpdate.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.handleAddCrude = this.handleAddCrude.bind(this);
        this.handleDeleteCrude = this.handleDeleteCrude.bind(this);
      }

      async componentDidMount() {
        if( this.props.modal.mode === 'update' || this.props.modal.mode === 'detail' || this.props.modal.mode === 'delete'){
            
            let dataCrude =  await this.props.data.refCrude.map(dt => {
              return {label:dt.sname,value:dt._id}
            });
            
            this.setState({
                _id: this.props.data._id,
                idplant:this.props.data.idplant,
                sname: this.props.data.sname,
                refimg: this.props.data.refimg,
                refCrude: dataCrude
            })

           
        }
      }

      handleAddCrude = () => {
        let newData = this.state.refCrude.concat(this.state.addCrude);
        this.setState({
          refCrude: newData,
          addCrude: null
        });
        this.togglePopup();
      }

      handleDeleteCrude = (e) => {
        console.log(e.target.id)
        let newData = this.state.refCrude.filter(dt => dt.value !== e.target.id);
        this.setState({
          refCrude: newData
        });
      }

      togglePopup = () => {
        this.setState({
          openModalCrude: !this.state.openModalCrude
        });
      }

      handleChange = name => value => {
        this.setState({
          [name]: value,
        });
        console.log(this.state)
      };

      valueChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
      }

      onChange(e) {
        this.setState({img:e.target.files[0]})
      }

      handleSubmitUpdate = event => {
        console.log(this.state)
        let user = localStorage.getItem("user")
        user = JSON.parse(user)
        let axiosConfig = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': user.token
                }
            };
            
        let url = '/jamu/api/plant/update/' + this.state.idplant

        const formData = new FormData();
     
      formData.append('name',this.state.name);
      formData.append('refimg',this.state.refimg);
      this.state.refCrude.map(item =>{
        formData.append('refCrude',item.value);
      })
      Axios.patch( url,formData ,axiosConfig)
        .then(data => {
            const res = data.data;
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        });
            event.preventDefault();
    }

    handleSubmitAdd = event => {

      let user = localStorage.getItem("user")
      user = JSON.parse(user)
      let axiosConfig = {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': user.token
              }
          };
          
      let url = '/jamu/api/plant/add';
      let refCrude = this.state.refCrude.map(data => data.value)
      Axios.post( url,{
        idplant: this.state.idplant,
        sname: this.state.sname,
        refimg: this.state.refimg,
        refCrude: refCrude
      },axiosConfig)
        .then(data => {
            const res = data.data;
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        });
            event.preventDefault();
    }

    handleSubmitDelete = event => {
        console.log(this.state)
        let user = localStorage.getItem("user")
        user = JSON.parse(user)
        let axiosConfig = {
                headers: {
                    'Authorization': user.token
                }
            };
            
        let url = '/jamu/api/plant/delete/' + this.state.idplant
      Axios.delete( url,axiosConfig)
        .then(data => {
            const res = data.data;
            console.log(res)
            window.location.hrefimg = '/plant';
        })
        .catch(err => {
            console.log(err)
        });
            event.preventDefault();
    }

render() {
  if(this.props.modal.mode === 'update'){
    return (
      <div>
        <Dialog open={this.props.modal.open} onClose={this.props.close} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">You update herbal medicine with id {this.state.idplant}</DialogTitle>
          <DialogContent>
            {/* <DialogContentText>
              You update herbal medicine with id {this.state.idplant}
            </DialogContentText> */}
            <TextField
              autoFocus
              margin="dense"
              id="sname"
              label="Plant Name"
              name="sname"
              type="text"
              value={this.state.sname}
              fullWidth
              onChange={this.valueChange}
            />
             <TextField
              margin="dense"
              id="refimg"
              label="Reff Image"
              name="refimg"
              type="text"
              value={this.state.refimg}
              fullWidth
              onChange={this.valueChange}
            />
            <Button onClick={this.togglePopup} color="primary">
              Add Crude Drug
            </Button>
            {this.state.openModalCrude === true ? <ModalrefCrude baseCrude={this.props.baseCrude} handleChange={this.handleChange} handleAddCrude={this.handleAddCrude} close={this.togglePopup} open={this.state.openModalCrude} />
              : 
              null
              }
            <ul className="reff">
                 {this.state.refCrude.map( item => (
                    <List item = { item } />
                ))}  
          </ul>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.close} color="primary">
              Cancel
            </Button>
            <Button onClick={this.props.close} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }else if(this.props.modal.mode === 'delete') {
    return (
      <Dialog
        open={this.props.modal.open}
        onClose={this.props.close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous location data to
            Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.close} color="primary">
            NO
          </Button>
          <Button onClick={this.props.close} color="primary" autoFocus>
            YES
          </Button>
        </DialogActions>
      </Dialog>
    )
  }else if(this.props.modal.mode === 'detail') {

  }else if(this.props.modal.mode === 'add') {
    return (
      <Dialog open={this.props.modal.open} onClose={this.props.close} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">You update herbal medicine with id {this.state.idplant}</DialogTitle>
          <DialogContent>
            {/* <DialogContentText>
              You update herbal medicine with id {this.state.idplant}
            </DialogContentText> */}
            <TextField
              autoFocus
              margin="dense"
              id="idplant"
              label="ID Plant"
              name="idplant"
              type="text"
              value={this.state.idplant}
              fullWidth
              onChange={this.valueChange}
            />
            <TextField
              margin="dense"
              id="sname"
              label="Plant Name"
              name="sname"
              type="text"
              value={this.state.sname}
              fullWidth
              onChange={this.valueChange}
            />
             <TextField
              margin="dense"
              id="refimg"
              label="Reff Image"
              name="refimg"
              type="text"
              value={this.state.refimg}
              fullWidth
              onChange={this.valueChange}
            />
            <Button onClick={this.togglePopup} color="primary">
              Add Crude Drug
            </Button>
            {this.state.openModalCrude === true ? <ModalrefCrude baseCrude={this.props.baseCrude} handleChange={this.handleChange} handleAddCrude={this.handleAddCrude} close={this.togglePopup} open={this.state.openModalCrude} />
              : 
              null
              }
            <ul className="reff">
                 {this.state.refCrude.map( item => (
                    <List item = { item } delete={this.handleDeleteCrude} />
                ))} 
            
          </ul>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.close} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmitAdd} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
    )
  }
    }
}

export default ModalPlant;
