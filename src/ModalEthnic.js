import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from 'react-select';

import LinearProgress from './LinearProgress'

import Axios from 'axios'

class ModalEthnic extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: false,
          _id: '',
          name:'',
          province: '',
          refPlantethnic: [],
          baseProvince: []
        }
        this.handleSubmitUpdate = this.handleSubmitUpdate.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onChange = this.onChange.bind(this);
      }

      async componentDidMount() {
        if( this.props.modal.mode === 'update' || this.props.modal.mode === 'detail' || this.props.modal.mode === 'delete'){
          let province = ''  
          if (this.props.data.refProvince){
              province = this.props.baseProvince.find(p => p.value === this.props.data.refProvince._id )
            }
            this.setState({
                _id: this.props.data._id,
                name: this.props.data.name,
                province: province !== undefined ? province : null ,
                refPlantethnic: this.props.data.refPlantethnic,
                baseProvince: this.props.baseProvince
            })

           
        }
      }

      valueChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
      }

      
      handleChange = name => value => {
        this.setState({
          [name]: value,
        });
        console.log(this.state)
      };

      onChange(e) {
        this.setState({url:e.target.files[0]})
      }

      handleSubmitUpdate = event => {
        this.setState({
          loading: true
        })
        let user = localStorage.getItem("user")
        user = JSON.parse(user)
        let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': user.token
                }
            };
            
        let url = '/jamu/api/ethnic/update/' + this.state._id

      Axios.patch( url,{
        name: this.state.name,
        refProvince: this.state.province.value
        } ,axiosConfig)
        .then(data => {
          const res = data.data;
          this.props.afterUpdate(res.success, res.message);
          this.setState({
            loading: false
          })
        })
        .catch(err => {
          if (err.response.data.message) {
            this.props.afterUpdate(false, err.response.data.message);
            this.setState({
              loading: false
            })
          }else{
            this.props.afterUpdate(false, err.message);
            this.setState({
              loading: false
            })
          }
        });
    }

    handleSubmitAdd = event => {
        this.setState({
          loading: true
        })
        let user = localStorage.getItem("user")
        user = JSON.parse(user)
        let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': user.token
                }
            };
            
        let url = '/jamu/api/ethnic/add'
      Axios.post( url, {
        name: this.state.name,
        refProvince: this.state.province.value
        },axiosConfig)
        .then(data => {
          const res = data.data;
          this.props.afterUpdate(res.success, res.message);
          this.setState({
            loading: false
          })
        })
        .catch(err => {
          if (err.response.data.message) {
            this.props.afterUpdate(false, err.response.data.message);
            this.setState({
              loading: false
            })
          }else{
            this.props.afterUpdate(false, err.message);
            this.setState({
              loading: false
            })
          }
        });
    }

    handleSubmitDelete = event => {
      this.setState({
        loading: true
      })
        let user = localStorage.getItem("user")
        user = JSON.parse(user)
        let axiosConfig = {
                headers: {
                    'Authorization': user.token
                }
            };
            
        let url = '/jamu/api/ethnic/delete/' + this.state._id
      Axios.delete( url,axiosConfig)
        .then(data => {
          const res = data.data;
          this.props.afterUpdate(res.success, res.message);
          this.setState({
            loading: false
          })
        })
        .catch(err => {
          if (err.response.data.message) {
            this.props.afterUpdate(false, err.response.data.message);
            this.setState({
              loading: false
            })
          }else{
            this.props.afterUpdate(false, err.message);
            this.setState({
              loading: false
            })
          }
      })
    }

render() {
  if(this.props.modal.mode === 'update'){
    return (
      <div>
        <Dialog open={this.props.modal.open} onClose={this.props.close} aria-labelledby="form-dialog-title">
        {this.state.loading ? 
              <LinearProgress />
                        : 
                        null
              }
          <DialogTitle id="form-dialog-title">You update ETHNIC with name {this.state.name} :</DialogTitle>
          <DialogContent
            style={{
              height:"200px"
            }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Ethnic Name"
              name="name"
              type="text"
              value={this.state.name}
              fullWidth
              onChange={this.valueChange}
            />
             <label style={{
               color:"grey",
               fontWeight:"lighter",
               fontSize:"13px",
               display:"block",
               marginTop:"10px",
               marginBottom:"5px"
             }}>
              referen province location : 
            </label>
            <Select
              value={this.state.province}
              onChange={this.handleChange('province')}
              options={this.state.baseProvince}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.close} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmitUpdate} color="primary">
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
        {this.state.loading ? 
              <LinearProgress />
                        : 
                        null
              }
        <DialogTitle id="alert-dialog-title">{"You want delete ?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          You want delete ETHNIC record data with name {this.state.name}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.close} color="primary">
            NO
          </Button>
          <Button onClick={this.handleSubmitDelete} color="primary" autoFocus>
            YES
          </Button>
        </DialogActions>
      </Dialog>
    )
  }else if(this.props.modal.mode === 'detail') {

  }else if(this.props.modal.mode === 'add') {
    return (
      <Dialog open={this.props.modal.open} onClose={this.props.close} aria-labelledby="form-dialog-title">
           {this.state.loading ? 
              <LinearProgress />
                        : 
                        null
              }
          <DialogTitle id="form-dialog-title">Create Data Record ETHNIC :</DialogTitle>
          <DialogContent
            style={{
              height:"400px",
              width:"400px"
            }}
          >
          <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Ethnic Name"
              name="name"
              type="text"
              value={this.state.name}
              fullWidth
              onChange={this.valueChange}
            />
             {/* <TextField
              margin="dense"
              id="province"
              label="Province"
              name="province"
              type="text"
              value={this.state.province}
              fullWidth
              onChange={this.valueChange}
            /> */}
            <label style={{
               color:"grey",
               fontWeight:"lighter",
               fontSize:"13px",
               display:"block",
               marginTop:"10px",
               marginBottom:"5px"
             }}>
              referen province location : 
            </label>
            <Select
              value={this.state.province}
              onChange={this.handleChange('province')}
              options={this.props.baseProvince}
            />
            <label style={{
               color:"grey",
               fontWeight:"lighter",
               fontSize:"13px",
               display:"block",
               marginTop:"10px",
               marginBottom:"5px"
             }}>
              referen plant ethnic : 
            </label>
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

export default ModalEthnic;
