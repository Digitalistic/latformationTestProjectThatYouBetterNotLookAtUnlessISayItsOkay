#pragma strict
// this example script will show you how you can set up a cheatMaster script for your project!
// this is useful for example if you want to  put something on the asset store and your users can use your system with cheatMaster
// please remember to delete cheatMaster.js before you are submitting to the asset store!!!!

// uncomment the code to use it

/*
var my_keywords : String[];
private var cm : cheatMaster;
function fill_array() // to prevent a timing error
{
	yield;
	cm.scripts_on_this_gameobject.Add(this); // let cheatMaster know that we exist
			for(var i = 0; i < my_keywords.length; i++)
			{
				cm.cheats.Add(my_keywords[i]);
			}
}

function Start()
{
		cm = GetComponent(cheatMaster) as cheatMaster;
		if(cm)// this script must be on the same gameobject as the cheatMaster
		{
			fill_array();
		}
		else
		{
			Debug.LogError("No Cheatmaster found!!! You can delete this script if you don't need it.");
		}
}

function activate_cheat(cheat) // put your cheat functions here
{
	if(cheat=="bigger") 
	{
		gameObject.FindWithTag("Player").transform.localScale+=Vector3.one/2;
		gameObject.FindWithTag("Player").transform.position.y+=1;
	}
	if(cheat=="smaller") 
	{
		gameObject.FindWithTag("Player").transform.localScale-=Vector3.one/2;
	}
	if(cheat=="up") 
	{
		gameObject.FindWithTag("Player").transform.position.y+=15;
	}
	if(cheat=="down") 
	{
		gameObject.FindWithTag("Player").transform.position.y-=15;
	}
	if(cheat=="nogravity") 
	{
		gameObject.FindWithTag("Player").rigidbody.useGravity=false;
	}
	if(cheat=="gravity") 
	{
		gameObject.FindWithTag("Player").rigidbody.useGravity=true;
	}
}*/