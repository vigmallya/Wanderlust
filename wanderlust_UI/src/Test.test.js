import React from "react";
import { shallow } from "enzyme";
import Home from "../src/components/home";
import Login from "../src/components/login";
import Register from "../src/components/register";
// import Hotdeals from "./Hotdeals";
import Book from "./Book";


describe('Home Component', () => {
    test('should redirect to hotdeals', () => {
      const wrapper = shallow(<Home />);
      wrapper.instance().getPackages();
      expect(wrapper.state().packagePage).toBeTruthy();
    });
    test("input fields", () => {
        const wrapper = shallow(<Home />);
        expect(wrapper.find("form").length+wrapper.find("input").length+wrapper.find("button").length).toEqual(5);
    });
    test("name tags", () => {
        const wrapper = shallow(<Home />);
        let status = false;
        if (wrapper.find("input").at(0).props().name == "continent" &&
          wrapper.find("input").at(1).props().name == "emailId" && 
          wrapper.find("button").at(0).props().name == "searchId" && 
          wrapper.find("button").at(1).props().name == "subId") { status = true; }
        expect(status).toEqual(true);
    });
  });

  describe('Login Component',()=>{
      test('T1',()=>{
        const wrapper = shallow(<Login />);
        expect(wrapper.find("form").length+wrapper.find("button").length).toEqual(3);
      });
      test('button check',()=>{
        const wrapper = shallow(<Login />);
        wrapper.instance().handleClick();
        expect(wrapper.state().loadRegister).toBeTruthy();
      });
      test('error name',()=>{
        const wrapper = shallow(<Login />);
        let loginformErrorMessage = Object.assign({}, wrapper.state().loginformErrorMessage);
        loginformErrorMessage.contactNo = true;
        loginformErrorMessage.password = true;
        wrapper.setState({ loginformErrorMessage });
        expect(wrapper.find('[name="logincontactNoError"]').length +
        wrapper.find('[name="loginpasswordError"]').length).toEqual(2);
      });
  });

  describe('Register Component',()=>{
      test('input tags',()=>{
        const wrapper = shallow(<Register />);
        expect(wrapper.find("form").length+wrapper.find("button").length).toEqual(2);
      });
      test('name tags',()=>{
        const wrapper = shallow(<Register />);
        let status = false;
        if (wrapper.find("button").at(0).props().name == "regId") { status = true; }
          expect(status).toEqual(true);
      });
      test('error name',()=>{
        const wrapper = shallow(<Register />);
        let registerformErrorMessage = Object.assign({}, wrapper.state().registerformErrorMessage);
        registerformErrorMessage.contactNo = true;
        registerformErrorMessage.password = true;
        registerformErrorMessage.name=true;
        registerformErrorMessage.emailId=true;
        wrapper.setState({ registerformErrorMessage });
        expect(wrapper.find('[name="registernameErrorMessage"]').length +
        wrapper.find('[name="registeremailIdErrorMessage"]').length +
        wrapper.find('[name="registercontactNoErrorMessage"]').length +
        wrapper.find('[name="registerpasswordErrorMessage"]').length).toEqual(4);
      });
  });
