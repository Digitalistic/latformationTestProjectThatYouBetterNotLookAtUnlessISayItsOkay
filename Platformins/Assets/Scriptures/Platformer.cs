using UnityEngine;
using System.Collections;

public class Platformer : MonoBehaviour 
{
	public float walkSpeed;
	public float runSpeed;
	public float jumpSpeed;
	public float gravScale;

	Vector2 myVelo;

	float xIn, yIn;

	bool isRunning = false;
	bool isGrounded = false;

	// Use this for initialization
	void Start () 
	{
		rigidbody2D.gravityScale = gravScale;	//Gravity, starring Sandra Bullock, coming soon to DVD and Blu-Ray!
	}
	
	// Update is called once per frame
	void Update () 
	{
		ProcessMovement();
	}

	void ProcessMovement()
	{
		myVelo = rigidbody2D.velocity;	//get the current velocity. we're going to mess with this!
		
		xIn = Input.GetAxis("Horizontal");
		yIn = Input.GetAxis("Vertical");

		yIn = yIn + 0;	//This line only exists so I can have 0 warnings.
		
		if(isRunning)	//if we're running, use run speed, and check for button release
		{
			myVelo.x = xIn * runSpeed;

			if(Input.GetButtonUp("Run"))
				EndRunning();
		}
		else   //if we're walking, use walk speed and check for run button press
		{
			myVelo.x = xIn * walkSpeed;
			
			if(Input.GetButtonDown("Run"))
				BeginRunning();
		}

		if(isGrounded)
		{
			if(Input.GetButtonDown("Jump"))
			{
				Jump();
			}
		}


		if(Mathf.Abs(myVelo.y) > jumpSpeed)	//limit y-axis speed for constant falling
		{
			if(myVelo.y > 0)
				myVelo.y = jumpSpeed;
			else
				myVelo.y = -jumpSpeed;
		}

		rigidbody2D.velocity = myVelo;	//apply our given velocity
	}

	void Jump()	//Jump around. Jump around. Jump up, jump up and get down!
	{
		myVelo.y = jumpSpeed;
	}

	//These two are seperate functions in case you want something to happen like a speed effect or whatever
	void BeginRunning()
	{
		isRunning = true;
	}

	void EndRunning()
	{
		isRunning = false;
	}

	//These two are seperate functions in case you want something to happen like dust particles or whatever
	public void LandOnFloor()
	{
		Debug.Log("On Floor");
		isGrounded = true;
	}

	public void LeaveFloor()
	{
		Debug.Log("Floor Departed");
		isGrounded = false;
	}
}
