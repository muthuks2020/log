

var unipaperapp = angular.module('unipaperApp',['ngRoute']);
		
unipaperapp.controller("unipaperCtrl", ['$scope','writerService',function($scope,writerService) 
{

  var myEl = angular.element( document.querySelector( '#storylistview' ) );
  //alert(myEl.length);

  if(myEl.length == 1)
  {     

    writerService.getStoryList($scope.writerarticle).then(function(response) 
    {
      //alert(JSON.stringify(response));
      $scope.username = response.username;
      $scope.university = response.universityname;
      $scope.city = response.city;
      $scope.facebooklink = response.faceboolinks;
      $scope.twitterlink = response.twitterlinks;
      $scope.storylists = response.storylist;   
      $scope.profilepicture = response.profilepicture;
      var profileupdate = response.profileupdate;
      if(profileupdate == "false")
      {
        $scope.showModal = !$scope.showModal;
      }
    });
  }

	$scope.writeStoryFunc = function()	
  {
    writerService.getProfileupdateStatus().then(function(response) 
    {
      if(response.profileupdate == "false")
      {
        alert("Please update your profile");
      }
      else
      {
        window.location.href = '/storytypeview';
      }
    });
	};
	
  $scope.writerarticle = {};

  $scope.storytypenext = function()
  {
    var storytype = $scope.selectedCat;
    if(storytype == undefined)
    {
      alert("Please select story type");
    }
    else
    {
      window.location.href = '/storyboardview/'+storytype;
    }
  };

  $scope.storytypeback = function(type)
  {
    window.location.href = '/storyview';
  };

  $scope.storypreviewnext = function()
  {
    window.location.href = '/storypreview';
  };

  $scope.selectCat = function(event)
  {
    //alert($(event.target).attr("storytype"));
    writerService.updateCategory($(event.target).attr("storytype")).then(function(response) 
    {
       $scope.selectedCat = $(event.target).attr("storytype");
        window.location.href = '/storyboardview/'+$scope.selectedCat;

    });
  };

  $scope.showUpdateProfileForm = function()
  {
    window.location.href = '/profileview';
  };

  $scope.profileview = function()
  {
    window.location.href = '/profileview';
  };

	$scope.writerArticleformsubmit = function() 
  {
    $scope.writerarticle.imageid = $scope.imageid;
		if($scope.writerarticle.title != "" && $scope.writerarticle.subheading != "" && $scope.writerarticle.bodycontent != "")
    {
  		writerService.saveStory($scope.writerarticle).then(function(response) 
      {
        alert(JSON.stringify("Article has been saved"));
        $scope.writerarticle.storyid = response.storyid;
        window.location.href = '/storypreview';    
      });
    }
    else
    {
      alert("Please fill all fields");
    }
	};

	$scope.uploadFile = function(files) {
    	var fd = new FormData();
    	//Take the first selected file
    	fd.append("profilepicturefile", files[0]);
    	writerService.saveFile(fd).then(function(response) {
    		//alert("file uploaed successfully "+JSON.stringify(response));
        $scope.imageid = response.fileid;
        $scope.filename = response.filename;
        $scope.picturename = '../uploads/'+response.filename;
    	});
	}

  $scope.submitArticletoContentful = function()
  {
    var articledata = {"articleid":"4"};
    writerService.submitArticletoContentful(articledata).then(function(response)
    {
      alert("Article submited to contentful successfully");
      window.location.href="/storyview";

    });
  }
  $scope.profileform = {};

  $scope.profileformSubmit = function()
  {
    $scope.profileform.imageid = $scope.imageid;

    writerService.profileformSubmit($scope.profileform).then(function(response)
    {
      alert("Profile updated successfully");
      window.location.href="/storyview";
    });  
  }
}]);


unipaperapp.directive('modal', function () 
{
    return {
      template: '<div class="modal fade">' + 
          '<div class="modal-dialog">' + 
            '<div class="modal-content">'+
            '<div class="modal-header">'+
            '<button data-dismiss="modal" class="close" type="button">×</button>'+
            '<h4 class="modal-title">Welcome! <br> Thanks for registering with University Paper</h4>'+
            '</div>'+
            '<div class="modal-body">'+
            '<p>Hey ! you have not completed your profile. <br> Update your profile to get started</p>'+
            '</div>'+
            '<div class="modal-footer btns">'+
            '<button data-dismiss="modal" class="btn btn-primary" type="button" ng-click="profileview()">Update profile</button>'+
            '<button data-dismiss="modal" class="btn btn-default" type="button">Exit</button>'+
            '</div>'+
            '</div>'+
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
          scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });