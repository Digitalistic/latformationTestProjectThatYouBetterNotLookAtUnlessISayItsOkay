using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class WallChekka : MonoBehaviour 
{
	public enum WallCheckPosition
	{
		Top,
		Middle,
		Bottom
	}

	Platformer owner;
	public List<Collider2D> walls;

	public WallCheckPosition myPos;
	
	void Start()
	{
		owner = transform.parent.GetComponent<Platformer>();
	}
	
	void OnTriggerEnter2D(Collider2D other)
	{
		//Debug.Log("Foot collision with " + other.name);
		
		if(walls.Count <= 0)
		{
			/*switch(myPos)
			{
				case WallCheckPosition.Top:		owner.DetectWallTop();	break;
				case WallCheckPosition.Middle:	owner.DetectWallMid();	break;
				case WallCheckPosition.Bottom:	owner.DetectWallBot();	break;
			}*/
		}

		if(walls.IndexOf(other) < 0)
			walls.Add(other);
		
		//Debug.Log("Landed: " + walls.Count.ToString());
	}
	
	void OnTriggerExit2D(Collider2D other)
	{
		//Debug.Log("Exited feet: " + other.name);

		//if(walls.IndexOf(other) >= 0)
			walls.Remove(other);
		
		if(walls.Count <= 0)
		{
			Debug.Log ("Removing Walls");

			/*switch(myPos)
			{
				case WallCheckPosition.Top:		owner.RemoveWallTop();	break;
				case WallCheckPosition.Middle:	owner.RemoveWallMid();	break;
				case WallCheckPosition.Bottom:	owner.RemoveWallBot();	break;
			}*/
		}
		
		//Debug.Log("Departed: " + walls.Count.ToString());
	}
	
	public void ClearCollisionList()
	{
		walls.Clear();

		/*switch(myPos)
		{
			case WallCheckPosition.Top:		owner.RemoveWallTop();	break;
			case WallCheckPosition.Middle:	owner.RemoveWallMid();	break;
			case WallCheckPosition.Bottom:	owner.RemoveWallBot();	break;
		}*/
	}
}
