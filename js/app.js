app = angular.module('app', ['ionic', 'firebase']);

angular.isempty = function(val){
  if(val === null || angular.isUndefined(val) == true || val == " " || val == ""){
    return true;
  }else{
    return false;
  }
}

app.service('dbrequest', function($http){
  this.doDbRequest = function(urll, meth, dataa){ 
    var request = $http({method: meth, url: urll, data: dataa});  
    return(request.then());
  }
});

app.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.when('', "/home");
$stateProvider
    .state("home", {
      url: '/home',
      templateUrl: "templates/home.html"
    }
    )

    .state("userhome", {
      url: '/userhome',
      templateUrl: "templates/userhome.html"
    }
    )

    .state("userhome.chats", {
      url: '/chats',
      templateUrl: "templates/chats.html"
    }
    )

     .state("userhome.classfellows", {
      url: '/classfellows',
      templateUrl: "templates/classfellows.html"
    }
    )

    .state("userhome.schoolfellows", {
      url: '/schoolfellows',
      templateUrl: "templates/schoolfellows.html"
    }
    )

    .state("userhome.profile", {
      url: '/profile/:id',
      templateUrl: "templates/profile.html"
    }
    )

    .state("userhome.bio", {
      url: '/bio',
      templateUrl: "templates/profile/bio.html"
    }
    )

     .state("userhome.mobilenum", {
      url: '/mobilenum',
      templateUrl: "templates/profile/mobilenum.html"
    }
    )

    .state("userhome.school", {
      url: '/school/:id',
      templateUrl: "templates/school.html"
    }
    )
    .state("userhome.passwordchange", {
      url: '/passwordchange',
      templateUrl: "templates/profile/password.html"
    }
    )

     .state("userhome.settings", {
      url: '/settings',
      templateUrl: "templates/profile/settings.html"
    }
    )

    .state("userhome.blockedpeople", {
      url: '/blockedpeople',
      templateUrl: "templates/profile/peopleblocked.html"
    }
    )

     .state("userhome.changerelationship", {
      url: '/changerelationship',
      templateUrl: "templates/profile/changerelationship.html"
    }
    )

    .state("userhome.profilepicture", {
      url: '/profilepicture',
      templateUrl: "templates/profile/profilepicture.html"
    }
    )

    .state("userhome.search", {
      url: '/search',
      templateUrl: "templates/search.html"
    }
    )

    .state("userhome.otherclass", {
      url:'/otherclass/:nameid/:school/:country/:branch/:classs',
      templateUrl: "templates/profile/otherClass.html"
    }
    )

    .state("userhome.share", {
      url:'/share/:country/:school/:branch/:byname/:share/:shareid/:anon:/when/:byid',
      templateUrl: "templates/share.html"
    }
    )

    .state("welcome", {
      url: '/welcome',
      templateUrl: "templates/welcome.html"
    }
    )

});

app.controller('homeCtrl', function($scope, $ionicPopup, dbrequest, $ionicLoading, $state, $firebase, dbrequest) {
  ref = new Firebase("https://rabbitapp.firebaseio.com");
  sync = $firebase(ref);
  $scope.signUp1Done = false;
  $scope.signin = false;
  $scope.signup = false;
  $scope.start = true;
  $scope.creatingAccount = false;
  $scope.selectClass = false;
  $scope.done = false;
  $scope.loggedin = false;
  $scope.processing = false;

  ref.onAuth(function(authData) {
  if (authData) {
      $scope.start = false;
      $scope.loggedin = true;
      $state.go('userhome.chats');
  }
  });

  $scope.signInStart = function(){
    $scope.start = false;
    $scope.signin = true;
  }

  $scope.signUpStart = function(){
     $scope.start = false;
     $scope.signup = true;
  }

   $scope.selectClassStep = function(){
     $scope.selectClass = true;
     $scope.signup = false;
  }

  $scope.signIn = function(){
      if(angular.isempty($scope.signinemail)){
      $ionicPopup.alert({
        title: 'Something went wrong..',
        content: 'You have to provide your email.',
        okType: 'buttonerror'
      });
    }else if(angular.isempty($scope.signinpassword)){
       $ionicPopup.alert({
        title: 'Something went wrong..',
        content: 'You have to provide your your password.',
        okType: 'buttonerror'
      });
    }else{
      $scope.processing = true;
      ref.authWithPassword({
        email    : $scope.signinemail,
        password : $scope.signinpassword
      }, function(error, authData) {
        if (error === null) {
            $state.go('userhome.chats');
        }else if(error.code === "INVALID_EMAIL" || error.code === "INVALID_USER"){
          $ionicPopup.alert({
            title: 'Incorrect Email',
            content: 'This account has not been created. Make sure you are using the correct email address.',
            okType: 'buttonerror'
          });
           $scope.processing = false;
        }else if(error.code === "INVALID_PASSWORD"){
          $ionicPopup.alert({
              title: 'Incorrect password',
              content: 'You have entered the wrong password. Make sure you are using the correct password., If you have forgotten your password then reset it.',
              okType: 'buttonerror'
            });
           $scope.processing = false;
        }
});;

  }
}


  $scope.step2Complete = function(){
    if(angular.isempty($scope.class)){
      $ionicPopup.alert({
        title: 'Something went wrong..',
        content: 'You have to provide your grade/class.',
        okType: 'buttonerror'
      });
    }else if(angular.isempty($scope.relationship)){
       $ionicPopup.alert({
        title: 'Something went wrong..',
        content: 'You have to provide your relationship status.',
        okType: 'buttonerror'
      });
    }else{
        $scope.selectClass = false;
        $scope.done = true;

        //Create user
        ref.createUser({
          email    : $scope.email,
          password : $scope.password
        }, function(error) {
          if(error === null) {
              $scope.selectClass = false;
              
              //Login user
              ref.authWithPassword({
                email    : $scope.email,
                password : $scope.password
              }, function(error, authData) {
                if(error === null) {
                  uid = authData.uid;
                  split = uid.split(":");
                  uid = split['1'];
                  //Store userinfo
                  refUsers = new Firebase("https//rabbitapp.firebaseio.com").child("Countries").child("Pakistan").child("Schools").child("The City School").child("Branches").child("Dera Ismail Khan").child("users");
                  Userssync = $firebase(refUsers);
                  Userssync.$update(uid, {id: uid, email: $scope.email, fname: $scope.fname, lname: $scope.lname, gender: $scope.gender, class: $scope.class, relationship: $scope.relationship, bio: "", mobilenum: "", showNum: true, school: "The City School", branch: "Dera Ismail Khan", country: "Pakistan", dateJoined: Firebase.ServerValue.TIMESTAMP}).then(function(){    
                    refIndex = new Firebase("https//rabbitapp.firebaseio.com").child("UserIndex"); 
                    IndexSync = $firebase(refIndex);

                    IndexSync.$update(uid, {id: uid, email: $scope.email, fname: $scope.fname, lname: $scope.lname, gender: $scope.gender, class: $scope.class, relationship: $scope.relationship, bio: "", mobilenum: "", showNum: true, school: "The City School", branch: "Dera Ismail Khan", country: "Pakistan", dateJoined: Firebase.ServerValue.TIMESTAMP}).then(function(){
                      if($scope.gender == "Male"){
                          $scope.profile = "img/icons/male_big.png";
                      }else{
                          $scope.profile = "img/icons/female_big.png";
                      }

                  refUserIndex = new Firebase("https//rabbitapp.firebaseio.com").child("Countries").child("Pakistan").child("Schools").child("The City School").child("Branches").child("Dera Ismail Khan").child("ClassIndex").child($scope.class);
                  UserIndexSync = $firebase(refUserIndex);
                    UserIndexSync.$update(uid, {id: uid, email: $scope.email, fname: $scope.fname, lname: $scope.lname, gender: $scope.gender, class: $scope.class, relationship: $scope.relationship, bio: "", mobilenum: "", showNum: true, school: "The City School", branch: "Dera Ismail Khan", country: "Pakistan", dateJoined: Firebase.ServerValue.TIMESTAMP}).then(function(){
                      //$scope.prof = true;
                    dbrequest.doDbRequest("http://lolnetwork.site50.net/thefirst/store.php", "POST", {id: uid, email: $scope.email, fname: $scope.fname, lname: $scope.lname, gender: $scope.gender, class: $scope.class, relationship: $scope.relationship, bio: "", mobilenum: "", showNum: true, school: "The City School", branch: "Dera Ismail Khan", country: "Pakistan"}).then(function(response){
                        if(reponse.done == true){
                          $state.go('welcome');
                      }
                    });
                    });
                    });
                  });
             
                }else{
                  $scope.done = false;
                  $scoep.signin = true;
                  $ionicPopup.alert({
                    title: 'Something went wrong..',
                    content: 'Your account has been created. We could not log you in, You have to login manually.',
                    okType: 'buttonerror'
                  });
                }
              });;
            
          }else if(error.code === "EMAIL_TAKEN"){
            $scope.done = false;
            $scope.signUp1Done = false;
            $scope.signup = true;
               $ionicPopup.alert({
                title: 'Something went wrong..',
                content: 'This email is already in use.',
                okType: 'buttonerror'
              });
          }else{
            $scope.done = false;
            $scope.signUp1Done = false;
            $scope.signup = true;
              $ionicPopup.alert({
                title: 'Something went wrong..',
                content: 'Could not create your account now. Try again after sometime.',
                okType: 'buttonerror'
              });
          }
        });
 
    }
  }

  $scope.signUp = function(){
    if(angular.isempty($scope.fname)){
        $ionicPopup.alert({
        title: 'Something went wrong..',
        content: 'You have to provide your first name.',
        okType: 'buttonerror'
      });
    }else if(angular.isempty($scope.lname)){
      $ionicPopup.alert({
        title: 'Something went wrong..',
        content: 'You have to provide your last name.',
        okType: 'buttonerror'
      });
    }else if(angular.isempty($scope.email)){
      $ionicPopup.alert({
        title: 'Something went wrong..',
        content: 'You have to provide your email.',
        okType: 'buttonerror'
      });
    }else if(angular.isempty($scope.password)){
      $ionicPopup.alert({
        title: 'Something went wrong..',
        content: 'You have to provide your password.',
        okType: 'buttonerror'
      });
    }else if(angular.isempty($scope.gender)){
      $ionicPopup.alert({
        title: 'Something went wrong..',
        content: 'You have to provide your gender.',
        okType: 'buttonerror'
      });
    }else{
      $scope.signUp1Done = true;
      $scope.selectClassStep();
    }
  }
});

app.controller('tabs', function($scope, $firebase) {
  ref = new Firebase("https://rabbitapp.firebaseio.com");
  authData = ref.getAuth();
  $scope.userId = authData.uid;
  split = $scope.userId .split(":");
  $scope.userId = split['1'];
});

app.controller('ClassfellowCtrl', function($scope, $firebase){
  $scope.loading = true;
  ref = new Firebase("https://rabbitapp.firebaseio.com");
  authData = ref.getAuth();
  $scope.userId = authData.uid;
  split = $scope.userId .split(":");
  $scope.userId = split['1'];
  userClass = null;
  sync = $firebase(ref);
  userData = ref.child("UserIndex").child($scope.userId).child("class");
  userData.on("value", function(snap){
    Class = snap.val();
    classFellowsPath = ref.child("Countries").child("Pakistan").child("Schools").child("The City School").child("Branches").child("Dera Ismail Khan").child("ClassIndex").child(Class);
    classFellowsSync = $firebase(classFellowsPath);
    $scope.classFellows = classFellowsSync.$asObject();

    $scope.classFellows.$loaded().then(function(){
        blockedBy = ref.child("blockedPeople").child($scope.userId);
          blockedBysync = $firebase(blockedBy);
          $scope.blockedby = blockedBysync.$asObject();
            $scope.blockedby.$loaded().then(function(){
               $scope.loading = false;
          });
    });
  });


  $scope.checkIfBlocked = function(id){
    if($scope.blockedby[id] != null){
      return true;
    }else{
      return false;
    }
  }
  });

app.controller('SchoolfellowCtrl', function($scope, $firebase, $ionicPopup){
  $scope.loading = true;
  ref = new Firebase("https://rabbitapp.firebaseio.com");
  authData = ref.getAuth();
  $scope.userId = authData.uid;
  split = $scope.userId .split(":");
  $scope.userId = split['1'];
  sync = $firebase(ref);
  schoolFellowsPath = ref.child("Countries").child("Pakistan").child("Schools").child("The City School").child("Branches").child("Dera Ismail Khan").child("users");
  schoolFellowsSync = $firebase(schoolFellowsPath);
  $scope.schoolFellows = schoolFellowsSync.$asObject();

  $scope.schoolFellows.$loaded().then(function(){
    blockedBy = ref.child("blockedPeople").child($scope.userId);
      blockedBysync = $firebase(blockedBy);
      $scope.blockedby = blockedBysync.$asObject();
        $scope.blockedby.$loaded().then(function(){
          $scope.loading = false;
        });
    });
  
  $scope.checkIfBlocked = function(id){
    if($scope.blockedby[id] != null){
      return true;
    }else{
      return false;
    }
  }
});

app.controller('schoolCtrl', function($scope, $stateParams, $ionicPopup, $firebase, $ionicLoading){

  $scope.show = function(text) {
    $ionicLoading.show({
      template: text
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide();
  };

  $scope.loading = true;
  ref = new Firebase("https://rabbitapp.firebaseio.com");
  authData = ref.getAuth();
  $scope.userId = authData.uid;
  split = $scope.userId .split(":");
  $scope.userId = split['1'];
  $scope.hideidentity = false;
    $scope.schoolId = $stateParams.id; 
      if(angular.isempty($scope.schoolId)){
        $scope.schoolId = 1;
      }
    $scope.schoolName = "The City School - Dera Ismail Khan";
  $scope.test = [];
  refPost = ref.child("Countries").child("Pakistan").child("Schools").child("The City School").child("Branches").child("Dera Ismail Khan").child("shares");
  postSync = $firebase(refPost);
  $scope.obj  = postSync.$asObject();
    $scope.obj.$loaded().then(function() {
        angular.forEach($scope.obj, function(value, key){
              obj = value;
              by = obj['by'];
              user = ref.child("UserIndex").child(by).child("fname");
              userr = $firebase(user);
              userfb = userr.$asObject();
              userfb.$loaded().then(function(){
                fname = userfb.$value;
                //obj['byname'] = userfb.$value;
                user = ref.child("UserIndex").child(by).child("lname");
                userl = $firebase(user);
                userlo = userl.$asObject();
                  userlo.$loaded().then(function(){
                    fullname = fname + " " + userlo.$value;
                    obj['byname'] = fullname;
                    var myDate = new Date(obj['when']);

                    date = myDate.toLocaleString(navigator.language, {day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit'});
                    obj['wheneng'] = date;
                    $scope.test.push(obj);
                      user = ref.child("UserIndex").child(by).child("dp");
                      userp = $firebase(user);
                      userdps = $firebase(userp);
                      userdpo = userdps.$asObject();
                      userdpo.$loaded.then(function(){
                         obj['dp'] = userdpo.$value;
                      });
                  });
              });

        });
      blockedBy = ref.child("blockedPeople").child($scope.userId);
      blockedBysync = $firebase(blockedBy);
      $scope.blockedby = blockedBysync.$asObject();
        $scope.blockedby.$loaded().then(function() {
            $scope.loading = false;
        });
    });

  $scope.checkIfBlocked = function(id){
    if($scope.blockedby[id] != null){
      return true;
    }else{
      return false;
    }
  }

    $scope.sharePost = function(){
        if(angular.isempty($scope.share)){
            $ionicPopup.alert({
              title: 'Hey!',
              content: 'You have to write something to share.',
              okType: 'buttonerror'
            });

            return false;
        }
    $scope.show("Sharing...");
    refPost = new Firebase("https//rabbitapp.firebaseio.com").child("Countries").child("Pakistan").child("Schools").child("The City School").child("Branches").child("Dera Ismail Khan").child("shares");
    postSync = $firebase(refPost);

    postSync.$push({share: $scope.share, when: Firebase.ServerValue.TIMESTAMP, by: $scope.userId, identity: $scope.hideidentity}).then(function(ref){
        postId = ref.name();
        ref = new Firebase("https//rabbitapp.firebaseio.com");
        userPosts = ref.child("UserIndex").child($scope.userId).child("shares");
        sync = $firebase(userPosts);
        sync.$update(postId, {id: postId, identity: $scope.hideidentity, when: Firebase.ServerValue.TIMESTAMP}).then(function(){
          $scope.hide();
        });
    });
    }

  $scope.reply = function(byname, share, shareid, anon, when, byid){
      $state.go("userhome.share", {"country": "Pakistan", "school": "The City School", "branch": "Dera Ismail Khan", "byname": byname, "share": share, "shareid": shareid, "anon": anon, "when": when, "byid": byid});
  }


});

app.controller('ProfileCtrl', function($scope, $stateParams, $firebase, $state, $ionicPopup, $ionicLoading){
  profileId = $stateParams.id;
  $scope.isThisUser = false;

  $scope.mobileNumberDone = true;
  $scope.bio = true;
  $scope.profileComplete = true;

  $scope.show = function(text) {
    $ionicLoading.show({
      template: text
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide();
  };



  ref = new Firebase("https://rabbitapp.firebaseio.com");
  authData = ref.getAuth();
  $scope.userId = authData.uid;
  split = $scope.userId .split(":");
  $scope.nomob = false;
  $scope.userId = split['1'];
    if($scope.userId == profileId){
      $scope.isThisUser = true;
    }


  userData = ref.child("UserIndex").child(profileId);
  sync = $firebase(userData);

  $scope.profileData = sync.$asObject();
  $scope.profileData.$loaded().then(function(){

  $scope.showClassfellows = function(){
    $state.go("userhome.otherclass", {"nameid": $scope.profileData.fname, "school": $scope.profileData.school, "classs": $scope.profileData.class, "branch": $scope.profileData.branch, "country": $scope.profileData.country, "namee": $scope.profileData.fname});
  }

   if(angular.isempty($scope.profileData.mobilenum)){
        $scope.mobileNumberDone = false;
    }
    if(angular.isempty($scope.profileData.bio)){
        $scope.bio = false;
    }
    if(angular.isempty($scope.profileData.mobilenum) || angular.isempty($scope.profileData.bio)){
        $scope.profileComplete = false;
    }

    if(angular.isempty($scope.profileData.mobilenum)){
      $scope.profileData.mobilenum = "Not Provided.";
      $scope.nomob = true;
    }

    $scope.block = function(){
      $ionicPopup.confirm({
        title: 'Block ' + $scope.profileData.fname + '?', // String. The title of the popup.
        content: 'Blocking ' + $scope.profileData.fname + ' will make it unable for both of you to contact each other. Are you sure you want to do this?', // String (optional). The sub-title of the popup.
        cancelType: 'buttondefault',
        okText: 'Yes',
        okType: 'buttonerror'
      }).then(function(object){
          if(object === true){
            $scope.show("Blocking " + $scope.profileData.fname);
              blockedPeople = ref.child("blockedPeople");
              blockedPeopleSync = $firebase(blockedPeople);
              var b = {};
              b[$scope.userId] = true;
              blockedPeopleSync.$update(profileId, b).then(function(){
                blockedBy = ref.child("blockedPeople").child("blockedBy").child($scope.userId);
                blockedBySync = $firebase(blockedBy);
                blockedBySync.$update(profileId, {fname: $scope.profileData.fname, lname: $scope.profileData.lname, id: profileId}).then(function(){
                $scope.hide();
                $ionicPopup.alert({
                  title: 'You have blocked ' + $scope.profileData.fname,
                  content: 'If you ever need to want to unblock ' + $scope.profileData.fname + ' you can do it from your account settings.',
                  okType: 'buttonerror'
                }).then(function(){
                  $state.go("userhome.chats");
                });
                });
              });
          }
      });
  }
  });
 
  $scope.logout = function(){
    ref.unauth();
    $state.go("home");
  }



});

app.controller('settings', function($scope, $firebase){
  ref = new Firebase("https://rabbitapp.firebaseio.com");
  authData = ref.getAuth();
  $scope.userId = authData.uid;
  split = $scope.userId .split(":");
  $scope.userId = split['1'];

  $scope.change = function(){
    if($scope.showMobileNum == true){
      $scope.showMobileNum = false;
    }else if($scope.showMobileNum == false){
      $scope.showMobileNum = true;
    }
    userIndex = ref.child("UserIndex").child($scope.userId);
    userIndexSync = $firebase(userIndex);
    userIndexSync.$update({showNum: $scope.showMobileNum});

    refUsers = new Firebase("https//rabbitapp.firebaseio.com").child("Countries").child("Pakistan").child("Schools").child("The City School").child("Branches").child("Dera Ismail Khan").child("users").child($scope.userId);
    refusersSync = $firebase(refUsers);
    refusersSync.$update({showNum: $scope.showMobileNum}); 

    classref = ref.child("UserIndex").child($scope.userId).child("class");
    syncclassref = $firebase(classref);
    classrefObj = syncclassref.$asObject();
    classrefObj.$loaded().then(function(){
      $scope.userclass = classrefObj.$value;
      refUserIndex = new Firebase("https//rabbitapp.firebaseio.com").child("Countries").child("Pakistan").child("Schools").child("The City School").child("Branches").child("Dera Ismail Khan").child("ClassIndex").child($scope.userclass).child($scope.userId);
      userClass = $firebase(refUserIndex);
      userClass.$update({showNum: $scope.showMobileNum}); 
    });
  }

  $scope.showMobileNum = true;
    mobilenumref = ref.child("UserIndex").child($scope.userId).child("showNum");
    syncMobileNum = $firebase(mobilenumref);
    showMobileNumObj = syncMobileNum.$asObject();
    showMobileNumObj.$loaded().then(function(){
      $scope.showMobileNum = showMobileNumObj.$value;
  });

});

app.controller('mobileNum', function($scope, $firebase, $ionicLoading, $ionicPopup, $state){
  ref = new Firebase("https://rabbitapp.firebaseio.com");
  authData = ref.getAuth();
  $scope.userId = authData.uid;
  split = $scope.userId .split(":");
  $scope.userId = split['1'];


  $scope.show = function() {
    $ionicLoading.show({
      template: "Saving mobile number."
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide();
  };

  $scope.saveNum = function(){
    if(angular.isempty($scope.mobilenum)){
      $ionicPopup.alert({
        title: 'Something went wrong..',
        content: 'You have not provided your mobile number.',
        okType: 'buttonerror'
      });
      return false;
    }
  $scope.show();
   currentNumref = ref.child("UserIndex").child($scope.userId).child("mobilenum");
    synccurrent = $firebase(currentNumref);
    currentnumobj = synccurrent.$asObject();
    currentnumobj.$loaded().then(function(){
      $scope.currentnum = currentnumobj.$value;
   checkNumber = ref.child("MobileIndex").child($scope.mobilenum);
    checkNumber.once("value", function(snap){
      if(snap.val() != null){
          $scope.hide();
        $ionicPopup.alert({
        title: 'Something went wrong..',
        content: 'This mobile number is already associated with a account.',
        okType: 'buttonerror'
      });
      return false;
      }else{
          if(angular.isempty($scope.currentnum) == false){
         mobIndex = ref.child("MobileIndex");
  sync = $firebase(mobIndex);
    sync.$remove($scope.currentnum).then(function(){
  sync.$update($scope.mobilenum, {user: $scope.userId}).then(function(){

  userIndex = ref.child("UserIndex").child($scope.userId);
  userIndexSync = $firebase(userIndex);
  userIndexSync.$update({mobilenum: $scope.mobilenum}).then(function(){
    refUsers = new Firebase("https//rabbitapp.firebaseio.com").child("Countries").child("Pakistan").child("Schools").child("The City School").child("Branches").child("Dera Ismail Khan").child("users").child($scope.userId);
    refusersSync = $firebase(refUsers);
    refusersSync.$update({mobilenum: $scope.mobilenum}).then(function(){
        classref = ref.child("UserIndex").child($scope.userId).child("class");
        syncclassref = $firebase(classref);
        classrefObj = syncclassref.$asObject();
        classrefObj.$loaded().then(function(){
    $scope.userclass = classrefObj.$value;
    refUserIndex = new Firebase("https//rabbitapp.firebaseio.com").child("Countries").child("Pakistan").child("Schools").child("The City School").child("Branches").child("Dera Ismail Khan").child("ClassIndex").child($scope.userclass).child($scope.userId);
    userClass = $firebase(refUserIndex);
    userClass.$update({mobilenum: $scope.mobilenum}).then(function(){
       $scope.hide();
        $ionicPopup.alert({
        title: 'Done',
        content: 'Your mobile number has been added.',
        okType: 'buttondefault'
      }).then(function(){
        $state.go("userhome.settings");
      });
    }); 
  });
    });
});
  });
});
}else{
   userIndex = ref.child("UserIndex").child($scope.userId);
  userIndexSync = $firebase(userIndex);
  userIndexSync.$update({mobilenum: $scope.mobilenum}).then(function(){
    refUsers = new Firebase("https//rabbitapp.firebaseio.com").child("Countries").child("Pakistan").child("Schools").child("The City School").child("Branches").child("Dera Ismail Khan").child("users").child($scope.userId);
    refusersSync = $firebase(refUsers);
    refusersSync.$update({mobilenum: $scope.mobilenum}).then(function(){
        classref = ref.child("UserIndex").child($scope.userId).child("class");
        syncclassref = $firebase(classref);
        classrefObj = syncclassref.$asObject();
        classrefObj.$loaded().then(function(){
    $scope.userclass = classrefObj.$value;
    refUserIndex = new Firebase("https//rabbitapp.firebaseio.com").child("Countries").child("Pakistan").child("Schools").child("The City School").child("Branches").child("Dera Ismail Khan").child("ClassIndex").child($scope.userclass).child($scope.userId);
    userClass = $firebase(refUserIndex);
    userClass.$update({mobilenum: $scope.mobilenum}).then(function(){
       $scope.hide();
        $ionicPopup.alert({
        title: 'Done',
        content: 'Your mobile number has been added.',
        okType: 'buttondefault'
      }).then(function(){
        $state.go("userhome.settings");
      });
    }); 
  });
    });
});
}
      }
       });
    });
 
}

});

app.controller('bio', function($scope, $firebase, $ionicLoading, $ionicPopup, $state){
  ref = new Firebase("https://rabbitapp.firebaseio.com");
  authData = ref.getAuth();
  $scope.userId = authData.uid;
  split = $scope.userId .split(":");
  $scope.userId = split['1'];

  $scope.show = function() {
    $ionicLoading.show({
      template: "Saving your bio."
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide();
  };

  $scope.saveBio = function(){
    if(angular.isempty($scope.bio)){
      $ionicPopup.alert({
        title: 'Something went wrong..',
        content: 'You have not provided your bio.',
        okType: 'buttonerror'
      });
      return false;
    }
  $scope.show();
  userIndex = ref.child("UserIndex").child($scope.userId);
  userIndexSync = $firebase(userIndex);
  userIndexSync.$update({bio: $scope.bio}).then(function(){
    refUsers = new Firebase("https//rabbitapp.firebaseio.com").child("Countries").child("Pakistan").child("Schools").child("The City School").child("Branches").child("Dera Ismail Khan").child("users").child($scope.userId);
    refusersSync = $firebase(refUsers);
    refusersSync.$update({bio: $scope.bio}).then(function(){
        classref = ref.child("UserIndex").child($scope.userId).child("class");
        syncclassref = $firebase(classref);
        classrefObj = syncclassref.$asObject();
        classrefObj.$loaded().then(function(){
    $scope.userclass = classrefObj.$value;
    refUserIndex = new Firebase("https//rabbitapp.firebaseio.com").child("Countries").child("Pakistan").child("Schools").child("The City School").child("Branches").child("Dera Ismail Khan").child("ClassIndex").child($scope.userclass).child($scope.userId);
    userClass = $firebase(refUserIndex);
    userClass.$update({bio: $scope.bio}).then(function(){
       $scope.hide();
        $ionicPopup.alert({
        title: 'Done',
        content: 'Your bio has been added.',
        okType: 'buttondefault'
      }).then(function(){
        $state.go("userhome.settings");
      });
    }); 
  });
    });

  });
}
});

app.controller('changePassword', function($scope, $firebase, $ionicLoading, $ionicPopup, $state){
  ref = new Firebase("https://rabbitapp.firebaseio.com");
  authData = ref.getAuth();
  $scope.userId = authData.uid;
  split = $scope.userId .split(":");
  $scope.userId = split['1'];
  $scope.emial = authData.password.email;
  $scope.show = function() {
    $ionicLoading.show({
      template: "Updating your password."
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide();
  };

  $scope.changepassword = function(){
    if(angular.isempty($scope.newpassword)){
      $ionicPopup.alert({
        title: 'Something went wrong..',
        content: 'You have not provided your new password.',
        okType: 'buttonerror'
      });
      return false;
    }

    if(angular.isempty($scope.oldpassword)){
      $ionicPopup.alert({
        title: 'Something went wrong..',
        content: 'You have not provided your old password.',
        okType: 'buttonerror'
      });
      return false;
    }

    $scope.show();

    ref.changePassword({
      email       : $scope.emial,
      oldPassword : $scope.oldpassword,
      newPassword : $scope.newpassword
    }, function(error) {
      if (error === null) {
         $scope.hide();
          $ionicPopup.alert({
            title: 'Done',
            content: 'Your password has been sucessfully changed.',
            okType: 'buttondefault'
          }).then(function(){
            $state.go("userhome.settings");
          });
      }else{
            $scope.hide();
          if(error.code === "INVALID_PASSWORD"){
            $ionicPopup.alert({
              title: 'Something went wrong..',
              content: 'Your old password is incorrect.',
              okType: 'buttonerror'
            });
          }
      }  
    });


}
});


app.controller('blockedpeoleCtrl', function ($scope, $firebase, $ionicLoading, $ionicPopup) {
  $scope.loading = true;
  ref = new Firebase("https://rabbitapp.firebaseio.com");
  authData = ref.getAuth();
  $scope.userId = authData.uid;
  split = $scope.userId .split(":");
  $scope.userId = split['1'];
  blockedpeopleref = ref.child("blockedPeople").child("blockedBy").child($scope.userId);
  blockedpeopleref.once("value", function(snap){
    if(snap.val() == null){
       $ionicPopup.alert({
          title: 'Hey!',
          content: 'You have not blocked anyone yet.',
          okType: 'buttondefault'
        })
      $scope.loading = false;
    }
  });
  blockedepeoplesync = $firebase(blockedpeopleref);
  $scope.blockedPeople = blockedepeoplesync.$asObject();

  $scope.blockedPeople.$loaded().then(function(){
    $scope.loading = false;
  });
  $scope.unblock = function(id, fname){
    blockedpeopleref = ref.child("blockedPeople").child("blockedBy").child($scope.userId);
    sync = $firebase(blockedpeopleref);
     $ionicPopup.confirm({
        title: 'Unblock ' + fname + '?', // String. The title of the popup.
        content: 'Unblocking ' + fname + ' will make it possible for both of you to contact each other.', // String (optional). The sub-title of the popup.
        cancelType: 'buttondefault',
        okText: 'Yes',
        okType: 'buttonerror'
      }).then(function(object){
        if(object == true){
            sync.$remove(id);
        }
      });
  }
  });


app.controller('relationshipCtrl', function ($scope, $ionicLoading, $ionicPopup) {
   ref = new Firebase("https://rabbitapp.firebaseio.com");
  authData = ref.getAuth();
  $scope.userId = authData.uid;
  split = $scope.userId .split(":");
  $scope.userId = split['1'];
  $scope.show = function() {
    $ionicLoading.show({
      template: "Changing your rleationship status."
    });
  };

  $scope.hide = function(){
    $ionicLoading.hide();
  };

    $scope.change = function(){
      if(anuglar.isempty($scope.relationship)){
         $ionicPopup.alert({
            title: 'Something went wrong...',
            content: 'You have to select your new relationship status.',
            okType: 'buttonerror'
          });
          return false;
      }
        $scope.show();
  userIndex = ref.child("UserIndex").child($scope.userId);
  userIndexSync = $firebase(userIndex);
  userIndexSync.$update({relationship: $scope.relationship}).then(function(){
    refUsers = new Firebase("https//rabbitapp.firebaseio.com").child("Countries").child("Pakistan").child("Schools").child("The City School").child("Branches").child("Dera Ismail Khan").child("users").child($scope.userId);
    refusersSync = $firebase(refUsers);
    refusersSync.$update({relationship: $scope.relationship}).then(function(){
        classref = ref.child("UserIndex").child($scope.userId).child("class");
        syncclassref = $firebase(classref);
        classrefObj = syncclassref.$asObject();
        classrefObj.$loaded().then(function(){
    $scope.userclass = classrefObj.$value;
    refUserIndex = new Firebase("https//rabbitapp.firebaseio.com").child("Countries").child("Pakistan").child("Schools").child("The City School").child("Branches").child("Dera Ismail Khan").child("ClassIndex").child($scope.userclass).child($scope.userId);
    userClass = $firebase(refUserIndex);
    userClass.$update({relationship: $scope.relationship}).then(function(){
       $scope.hide();
        $ionicPopup.alert({
        title: 'Done',
        content: 'Your relationship status has been updated.',
        okType: 'buttondefault'
      }).then(function(){
        $state.go("userhome.settings");
      });
    }); 
  });
    });

  });
    }
});

app.controller('otherClassCtrl', function ($scope, $firebase, $stateParams) {
  $scope.loading = true;
  ref = new Firebase("https://rabbitapp.firebaseio.com");
  authData = ref.getAuth();
  $scope.userId = authData.uid;
  split = $scope.userId .split(":");
  $scope.userId = split['1'];
  $scope.namee = $stateParams.nameid;
  $scope.school = $stateParams.school;
  $scope.country = $stateParams.country;
  $scope.branch = $stateParams.branch;
  $scope.class = $stateParams.classs;
  userClass = null;
  sync = $firebase(ref);
  userData = ref.child("UserIndex").child($scope.userId).child("class");
  userData.on("value", function(snap){
    classFellowsPath = ref.child("Countries").child($scope.country).child("Schools").child($scope.school).child("Branches").child($scope.branch).child("ClassIndex").child($scope.class);
    classFellowsSync = $firebase(classFellowsPath);
    $scope.classFellows = classFellowsSync.$asObject();

    $scope.classFellows.$loaded().then(function(){
        blockedBy = ref.child("blockedPeople").child($scope.userId);
          blockedBysync = $firebase(blockedBy);
          $scope.blockedby = blockedBysync.$asObject();
            $scope.blockedby.$loaded().then(function(){
               $scope.loading = false;
          });
    });
  });


  $scope.checkIfBlocked = function(id){
    if($scope.blockedby[id] != null){
      return true;
    }else{
      return false;
    }
  }
});

app.controller('shareCon', function($scope, $stateParams) {
  $scope.country = $stateParams.country;
  $scope.school = $stateParams.school;
  $scope.branch = $stateParams.branch;
  $scope.byname = $stateParams.byname;
  $scope.share = $stateParams.share;
  $scope.shareid = $stateParams.shareid;
  $scope.anon = $stateParams.anon;
  $scope.when = $stateParams.when;
  $scope.byid = $stateParams.byid;
  $scope.prof = $stateParams.prof;
 
});